var SideBarView = Backbone.View.extend({

    _template: _.itemplate($('#sideBarTemplate').html()),

    initialize: function() {
        this.model.bind('change:actives', this.render, this);
    },

    render: function (title, showTenants) {
        var self = this;
        var html = self._template({models: self.model.models, showTenants: showTenants, loginModel: this.options.loginModel, title: title});
        $(self.el).empty();
        $(self.el).html(html);
        $("#tenant_switcher").selectbox({
            onChange: function (val, inst) {
                window.location = val;
            }
        });
    }

});