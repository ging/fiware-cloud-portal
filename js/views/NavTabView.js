var NavTabView = Backbone.View.extend({

    _template: _.itemplate($('#navTabTemplate').html()),

    initialize: function() {
        this.model.bind('change:actives', this.render, this);
        this.options.loginModel = UTILS.GlobalModels.get("loginModel");
    },

    render: function () {
        var self = this;
        $(self.el).empty().html(self._template({models: self.model.models, showAdmin: self.options.loginModel.isAdmin(), tenants: self.options.tenants, tenant: self.options.tenant}));
        return this;
    }

});