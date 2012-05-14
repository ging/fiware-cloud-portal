var ProjectView = Backbone.View.extend({
    
    _template: _.itemplate($('#projectsTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.rerender, this);
        this.render();
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    
    rerender: function() {
        if ($("#tenants").html() != null) {
            $(this.el).empty().html(this._template(this.model));
        }
    } 
});