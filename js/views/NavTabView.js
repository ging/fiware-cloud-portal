var NavTabView = Backbone.View.extend({
    
    _template: _.itemplate($('#navTabTemplate').html()),
    
    initialize: function() {
        this.model.bind('change:actives', this.render, this);
    },
    
    render: function () {
        console.log("Rendering NavTabView");
        var self = this;
        $(self.el).empty().html(self._template({models: self.model.models, showAdmin: this.options.loginModel.isAdmin(), tenants: this.options.tenants, tenant: this.options.tenant}));
        return this;
    }
    
});