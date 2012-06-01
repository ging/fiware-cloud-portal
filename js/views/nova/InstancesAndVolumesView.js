var InstancesAndVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaInstancesAndVolumesTemplate').html()),
    
    instancesView: undefined,
    volumesView: undefined,
    
    initialize: function() {
        this.render();
        this.instancesView = new NovaInstancesView({model: this.options.instancesModel, flavors: this.options.flavors, el: '#instances'});
        this.volumesView = new NovaVolumesView({model: this.options.volumesModel, el: '#volumes'});
    },
    
  	onClose: function() {
  	    this.instancesView.onClose();
  	    this.volumesView.onClose();
        this.undelegateEvents();
        this.unbind();
    },
  	
    render: function() {
        var self = this;
        
        UTILS.Render.animateRender(this.el, this._template);
        
        
    },
        
});