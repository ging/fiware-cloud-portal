var QuotaView = Backbone.View.extend({
    
    _template: _.itemplate($('#quotasTemplate').html()),
    
    initialize: function() {
       this.model.unbind("reset");
       this.model.bind("reset", this.rerender, this);
       this.model.fetch();
    },
    
     rerender: function() {
    	var self = this;
    	UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
    },
    
});