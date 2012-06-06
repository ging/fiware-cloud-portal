var ImagesAndSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaImagesAndSnapshotsTemplate').html()),
    
    imagesView: undefined,
    instanceSnapshotsView: undefined,
    volumeSnapshotsView: undefined,
    
    initialize: function() {
        this.render();
        this.imagesView = new NovaImagesView({model: this.options.images, flavors: this.options.flavors, el: '#images'});
        this.instanceSnapshotsView = new NovaInstanceSnapshotsView({model: this.options.images, flavors: this.options.flavors, el: '#instance_snapshots'});
        this.volumeSnapshotsView = new NovaVolumeSnapshotsView({model: this.options.volumeSnapshotsModel, el: '#volume_snapshots'});
    },
    
  	onClose: function() {
  	    this.imagesView.onClose();
  	    this.instanceSnapshotsView.onClose();
  	    this.volumeSnapshotsView.onClose();
        this.undelegateEvents();
        this.unbind();
    },
  	
    render: function() {
        var self = this;
        
        UTILS.Render.animateRender(this.el, this._template);
        
        
    },
        
});