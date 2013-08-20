var SideBarView = Backbone.View.extend({

    _template: _.itemplate($('#sideBarTemplate').html()),

    initialize: function() {
        this.model.bind('change:actives', this.render, this);
    },

    render: function () {
        var self = this;
        $(self.el).empty().html(self._template({models: self.model.models, showTenants: self.options.showTenants, loginModel: this.options.loginModel, title: self.options.title}));
        $("#tenant_switcher").selectbox({
            onChange: function (val, inst) {
                window.location = val;
            }
        });
        var subview = new MessagesView({state: "Info", title: "Connected to project " + self.options.loginModel.get("tenant").name + " (ID " + self.options.loginModel.get("tenant").id + ")"});
        subview.render();
    }

});