var UserView = Backbone.View.extend({
    
    _template: _.itemplate($('#usersTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    } 
});