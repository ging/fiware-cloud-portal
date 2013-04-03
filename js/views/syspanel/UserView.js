var UserView = Backbone.View.extend({

    _template: _.itemplate($('#usersTemplate').html()),

    timer: undefined,

    tableView: undefined,

    initialize: function() {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.timer = setInterval(function() {
            self.model.fetch();
        }, 10000);
        this.model.fetch();
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label:  "Create User",
            action: "create"
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        var disabledGroupSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get('enabled')) {
                        return false;
                    }
                }
                return true;
            }
        };
        var enabledGroupSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (!entry.get('enabled')) {
                        return false;
                    }
                }
                return true;
            }
        };
        return [{
            label:"Edit User", action:"edit", activatePattern: oneSelected
        },
        {
            label: "Enable Users", action: "enable", activatePattern: disabledGroupSelected
        },
        {
            label:  "Disable Users", action: "disable", activatePattern: enabledGroupSelected
        },
        {
            label: "Delete Users", action: "delete", activatePattern: groupSelected, warn: true
        }
        ];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [
            {
                type: "checkbox",
                size: "5%"
            },
            {
                name: "Name",
                tooltip: "User's name",
                size: "35%",
                hidden_phone: false,
                hidden_tablet:false
            },
            {
                name: "Email",
                tooltip: "User's email address",
                size: "35%",
                hidden_phone: true,
                hidden_tablet:false
            },
            {
                name: "Enabled",
                tooltip: "Check if user is enabled",
                size: "10%",
                hidden_phone: false,
                hidden_tablet:false
            }
        ];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var user = this.model.models[index];

            var entry = {id: user.get('id'), cells: [{
                    value: user.get("name")
                },
                { value: user.get("email")
                },
                { value: user.get("enabled")
                }
                ]};
            entries.push(entry);
        }
        return entries;
    },

    onAction: function(action, userIds) {
        var user, usr, subview;
        var self = this;
        if (userIds.length === 1) {
            user = userIds[0];
            usr = this.model.get(user);
        }
        console.log(self.options);
        switch (action) {
            case 'create':
                subview = new CreateUserView({el: 'body', model:usr, tenants: self.options.tenants});
                subview.render();
                break;
            case 'edit':
                subview = new EditUserView({el: 'body', model:usr, tenants: self.options.tenants});
                subview.render();
                break;
            case 'disable':
                subview = new ConfirmView({el: 'body', title: "Confirm Disable Users", btn_message: "Disable Users", onAccept: function() {
                    userIds.forEach(function(user) {
                        usr = self.model.get(user);
                        if (usr.get("enabled") === true) {
                            usr.set("enabled", false);
                            usr.save();
                        }
                        subview = new MessagesView({el: '#content', state: "Success", title: "Users disabled"});
                        subview.render();
                    });
                }});
                subview.render();
                break;
            case 'enable':
                subview = new ConfirmView({el: 'body', title: "Confirm Enable Users", btn_message: "Enable Users", onAccept: function() {
                    userIds.forEach(function(user) {
                        usr = self.model.get(user);
                        if (usr.get("enabled") === false) {
                            usr.set("enabled", true);
                            usr.save();
                        }
                        subview = new MessagesView({el: '#content', state: "Success", title: "Users enabled"});
                        subview.render();
                    });
                }});
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({el: 'body', title: "Confirm Delete Users", btn_message: "Delete Users", onAccept: function() {
                    userIds.forEach(function(user) {
                        usr = self.model.get(user);
                        user.destroy();
                        var subview = new MessagesView({el: '#content', state: "Success", title: "User deleted."});
                        subview.render();
                    });
                }});
                subview.render();
                break;
        }
    },

    onClose: function () {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        clearInterval(this.timer);
    },

    renderFirst: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#users-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
        return this;
    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }
});