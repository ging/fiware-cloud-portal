var ServiceView = Backbone.View.extend({
    
    _template: _.itemplate($('#servicesTemplate').html()),
    
    initialize: function() {
    	this.model.bind("reset", this.rerender, this);
        this.model.fetch();        
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    } 
});