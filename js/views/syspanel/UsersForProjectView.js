var UsersForProjectView = Backbone.View.extend({

    _template: _.itemplate($('#usersForProjectTemplate').html()),
    interval: undefined,

    initialize: function() {
        var self = this;
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.options.users.unbind("reset");
        this.options.users.bind("reset", this.render, this);
        this.renderFirst();
        this.options.roles = new Roles();
        this.options.tenants.bind("reset", this.render, this);
        this.options.users.fetch();
        self.options.roles.fetch();
        this.fetch(this);
        this.interval = setInterval(function() {
            self.fetch(self);
        }, 5000);
    },

    fetch: function(self) {
        self.model.fetch();
    },

    events: {
        'click .btn-add' : 'onAdd',
        'click .btn-delete':'onDelete'
    },

    onAdd: function(evt) {
        var user = evt.target.value;
        console.log("Adding user: ", user, " to tenant ", this.options.tenants.get(this.options.tenant));
        var subview = new AddUserToProjectView({el: 'body', model:this.options.users.get(user), tenant: this.options.tenants.get(this.options.tenant), roles:this.options.roles});
        subview.render();
    },

    onDelete: function(evt) {
        var self = this;
        var user = self.model.get(evt.target.value);
        console.log("User to delete: ", user);
        var tenant = self.options.tenants.get(self.options.tenant);
        var success = function() {
            var subview = new MessagesView({el: '#content', state: "Success", title: "User removed."});
            subview.render();
        };
        var subview = new ConfirmView({el: 'body', title: "Confirm Remove User from Project", btn_message: "Remove User", onAccept: function() {
                user.getRoles(tenant.get('id'), {success: function(roles) {
                    for (var idx in roles.roles) {
                        var role = roles.roles[idx];
                        user.removeRole(role.id, tenant.get('id'), {success: success});
                    }
                }});
        }});
        subview.render();
    },

    onClose: function() {
        this.undelegateEvents();
        this.model.unbind("reset");
        this.options.tenants.unbind('reset');
        this.options.users.unbind('reset');
        clearInterval(this.interval);
    },

    renderFirst: function () {
        this.undelegateEvents();
        var that = this;
        UTILS.Render.animateRender(this.el, this._template, {model: this.model, users: this.options.users.models, tenant: this.options.tenants.get(this.options.tenant)}, function() {
            that.delegateEvents(that.events);
        });

    },

    render: function () {
        this.undelegateEvents();
        $(this.el).empty().html(this._template({model: this.model, users: this.options.users.models, tenant: this.options.tenants.get(this.options.tenant)}));
        this.delegateEvents(this.events);
        return this;
    }


});