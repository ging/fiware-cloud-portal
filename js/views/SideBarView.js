var SideBarView = Backbone.View.extend({
    
    _template: _.template($('#sideBarTemplate').html()),
    
    initialize: function() {
        this.model.bind('change:actives', this.render, this);
    },
    
    render: function () {
        var self = this;
        $(self.el).empty().html(self._template({models: self.model.models, showTenants: self.options.showTenants, tenants: this.options.tenants, tenant: this.options.tenant}));
        $('#sideBarTitle').empty().html(self.options.title);
    }
    
});