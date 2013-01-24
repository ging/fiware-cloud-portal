var NovaSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaSnapshotsTemplate').html()),
    
    instanceSnapshotsView: undefined,
    volumeSnapshotsView: undefined,
    
    initialize: function() {
    	console.log(this.options.images);
        this.render();
        this.instanceSnapshotsView = new NovaInstanceSnapshotsView({model: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, el: '#instance_snapshots'});
        this.volumeSnapshotsView = new NovaVolumeSnapshotsView({model: this.options.volumeSnapshotsModel, instancesModel: this.options.instancesModel, volumesModel: this.options.volumesModel, flavors: this.options.flavors, el: '#volume_snapshots'});
    },
    
  	onClose: function() {
  	    this.instanceSnapshotsView.onClose();
  	    this.volumeSnapshotsView.onClose();
        this.undelegateEvents();
        this.unbind();
    },
  	
    render: function() {    	
        var self = this;        
        UTILS.Render.animateRender(this.el, this._template);
        
        
    }
        
});