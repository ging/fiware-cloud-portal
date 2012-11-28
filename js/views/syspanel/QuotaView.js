var QuotaView = Backbone.View.extend({
    
    _template: _.itemplate($('#quotasTemplate').html()),
    
    initialize: function() {
       this.model.unbind("reset");
       this.model.bind("reset", this.rerender, this);
       this.model.fetch();
       
    },
    
     rerender: function() {
    	var self = this;
    	console.log(self.model.models);
    	UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
    },
    
});