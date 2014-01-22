var UsersForProjectView = Backbone.View.extend({

    _template: _.itemplate($('#usersForProjectTemplate').html()),
    interval: undefined,

    allTableView: undefined,
    newTableView: undefined,

    events: {
        'click #gthan': 'onRemove',
        'click #lthan': 'onAdd'
    },

    initialize: function() {
        var self = this;
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.options.tenants = UTILS.GlobalModels.get("projects");
        this.options.users.unbind("reset");
        this.options.users.bind("reset", this.render, this);
        this.renderFirst();
        this.options.roles = new Roles();
        this.options.tenants.bind("reset", this.render, this);
        this.options.users.fetch();
        self.options.roles.fetch();
        this.model.fetch();
        this.interval = setInterval(function() {
            self.model.fetch();
        }, 5000);
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
    },

    getNewDropdownButtons: function() {
        return [];
    },

    getNewHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "User's name",
            size: "50%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Email",
            tooltip: "Email address",
            size: "50%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getNewEntries: function() {
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        var entries = [];
        for (var index in this.model.models) {
            var user = this.model.models[index];
            var entry = {
                id: user.get('id'),
                cells: [{
                    value: user.get("name")
                }, {
                    value: user.get('email')
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    getAllDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        return [];
    },

    getAllHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "User's name",
            size: "50%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Email",
            tooltip: "Email address",
            size: "50%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getAllEntries: function() {
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        var entries = [];
        for (var index in this.options.users.models) {
            var user = this.options.users.models[index];
            if (!this.model.get(user.get('id'))) {
                var entry = {
                    id: user.get('id'),
                    cells: [{
                        value: user.get("name")
                    }, {
                        value: user.get('email')
                    }]
                };
                entries.push(entry);
            }
        }
        return entries;
    },

    onRemove: function(evt) {
        var entries = this.newTableView.getSelectedEntries();
        console.log(entries);
        if (entries.length > 0) {
            this.onAction("remove", entries);
        }
    },

    onAdd: function(evt) {
        var entries = this.allTableView.getSelectedEntries();
        console.log(entries);
        if (entries.length > 0) {
            this.onAction("add", entries);
        }
    },

    onAction: function(action, userIds) {
        var user, usr, subview;
        var self = this;
        if (userIds.length === 1) {
            user = userIds[0];
            usr = this.options.users.get(user);
        }

        var onSuccess = function(usr) {
            return function(roles) {
                for (var idx in roles.roles) {
                    var role = roles.roles[idx];
                    usr.removeRole(role.id, self.options.tenant, UTILS.Messages.getCallbacks("User "+usr.get("name") + " removed.", "Error removing user "+usr.get("name")));
                }
            };
        };

        switch (action) {
            case 'remove':
                subview = new ConfirmView({el: 'body', title: "Confirm Remove User from Project", btn_message: "Remove User", onAccept: function() {
                    for (var idx in userIds) {
                        user = userIds[idx];
                        usr = self.options.users.get(user);
                        usr.getRoles(self.options.tenant, {success: onSuccess(usr)});
                    }
                }});
                subview.render();
                break;
            case 'add':
                var userEntries = [];
                for (var idx in userIds) {
                    user = userIds[idx];
                    usr = this.options.users.get(user);
                    userEntries.push(usr);
                }
                subview = new AddUserToProjectView({el: 'body', users:userEntries, tenant: this.options.tenants.get(this.options.tenant), roles:this.options.roles});
                subview.render();
                break;
        }
    },

    onClose: function() {
        this.undelegateEvents();
        this.model.unbind("sync");
        this.options.tenants.unbind('reset');
        this.options.users.unbind('reset');
        clearInterval(this.interval);
    },

    renderFirst: function () {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {model: this.model, users: this.options.users.models, tenant: this.options.tenants.get(this.options.tenant)}, function() {
            self.delegateEvents(self.events);
        });
        this.newTableView = new TableView({
            model: this.model,
            el: '#new-users-table',
            onAction: this.onAction,
            getDropdownButtons: this.getNewDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getNewHeaders,
            getEntries: this.getNewEntries,
            context: this
        });
        this.newTableView.render();

        this.allTableView = new TableView({
            model: this.model,
            el: '#all-users-table',
            onAction: this.onAction,
            getDropdownButtons: this.getAllDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getAllHeaders,
            getEntries: this.getAllEntries,
            context: this
        });
        this.allTableView.render();
    },

    render: function () {
        if ($(this.el).html() !== null) {
            this.newTableView.render();
            this.allTableView.render();
        }
        return this;
    }


});