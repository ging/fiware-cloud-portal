var FlavorView = Backbone.View.extend({
    
    _template: _.template($('#flavorsTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
});