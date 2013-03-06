var UserView = Backbone.View.extend({

    _template: _.itemplate($('#usersTemplate').html()),
    timer: undefined,

    initialize: function() {
        var self = this;
        this.model.bind("reset", this.rerender, this);
        this.timer = setInterval(function() {
            self.model.fetch();
        }, 3000);
        this.render();
    },

    events: {
        'click .btn-create': 'onCreate',
        'click .btn-edit' : 'onUpdate',
        'click .btn-delete':'onDelete',
        'click .btn-disable':'onDisable',
        'click .btn-enable':'onEnable',
        'click .btn-delete-group': 'onDeleteGroup',
        'change .checkbox_users':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll'
    },

    onCreate: function() {
        var subview = new CreateUserView({el: 'body', model:this.model, tenants: this.options.tenants});
        subview.render();
    },

    onUpdate: function(evt) {
        var user = this.model.get(evt.target.value);
        var subview = new EditUserView({el: 'body', model:user, tenants: this.options.tenants});
        subview.render();
    },

    onDisable: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Disable User", btn_message: "Disable User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.set("enabled", false);
            user.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User disabled."});
            subview.render();

        }});
        subview.render();
    },

    onEnable: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Enable User", btn_message: "Enable User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.set("enabled", true);
            user.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User enabled."});
            subview.render();

        }});
        subview.render();
    },

    onDelete: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete User", btn_message: "Delete User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User deleted."});
            subview.render();

        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Delete Projects", btn_message: "Delete Projects", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var user = $(this).val();
                    var usr = self.model.get(user);
                    usr.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Project deleted."});
                    subview.render();

            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_users").attr('checked','checked');
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_users").attr('checked',false);
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_users:checked").size() > 0) {
            $("#users_delete").attr("disabled", false);
        } else {
            $("#users_delete").attr("disabled", true);
        }

    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
        clearInterval(this.timer);
    },

    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },

    rerender: function() {
        console.log("Rendering");
        $(this.el).empty().html(this._template(this.model));
    }
});