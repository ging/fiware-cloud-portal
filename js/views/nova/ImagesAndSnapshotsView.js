var ImagesAndSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaImagesAndSnapshotsTemplate').html()),
    
    imagesAndInstanceSnapshotsView: undefined,
    volumeSnapshotsView: undefined,
    
    initialize: function() {
        this.render();
        this.imagesAndInstanceSnapshotsView = new NovaImagesAndInstanceSnapshotsView({model: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, el: '#images_snapshots'});;
        this.volumeSnapshotsView = new NovaVolumeSnapshotsView({model: this.options.volumeSnapshotsModel, instancesModel: this.options.instancesModel, volumesModel: this.options.volumesModel, flavors: this.options.flavors, el: '#volume_snapshots'});
    },
    
  	onClose: function() {
  	    this.imagesAndInstanceSnapshotsView.onClose();
  	    this.volumeSnapshotsView.onClose();
        this.undelegateEvents();
        this.unbind();
    },
  	
    render: function() {
        var self = this;
        
        UTILS.Render.animateRender(this.el, this._template);
        
        
    },
        
});