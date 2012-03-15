var QuotaView = Backbone.View.extend({
    
    _template: _.template($('#quotasTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
});