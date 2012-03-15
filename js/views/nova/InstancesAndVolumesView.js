var InstancesAndVolumesView = Backbone.View.extend({
    
    _template: _.template($('#novaInstancesAndVolumesTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
});