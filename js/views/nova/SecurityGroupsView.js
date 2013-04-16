var NovaSecurityGroupsView = Backbone.View.extend({

    _template: _.itemplate($('#novaSecurityGroupsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Create Security Group",
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
        return [{
            label: "Edit Rules",
            action: "edit",
            activatePattern: oneSelected
        }, {
            label: "Delete Rules",
            action: "delete",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "Security Group's name",
            size: "45%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Security Group's description",
            size: "50%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var sec_group;
        for (var i in this.model.models) {
            sec_group = this.model.models[i];
            var entry = {
                id: sec_group.get('id'),
                cells: [{
                    value: sec_group.get("name")
                }, {
                    value: sec_group.get("description")
                }]
            };
            entries.push(entry);
        }

        return entries;
    },

    onAction: function(action, secGroupIds) {
        var securityGroup, sg, subview;
        var self = this;
        if (secGroupIds.length === 1) {
            securityGroup = secGroupIds[0];
            sg = this.model.get(securityGroup);
        }
        switch (action) {
            case 'create':
                subview = new CreateSecurityGroupView({el: 'body', model: this.model});
                subview.render();
                break;
            case 'edit':
                subview = new EditSecurityGroupRulesView({el: 'body', securityGroupId: securityGroup, model: this.model});
                subview.render();
            break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Security Group",
                    btn_message: "Delete Security Group",
                    onAccept: function() {
                        secGroupIds.forEach(function(securityGroup) {
                            sg = self.model.get(securityGroup);
                            sg.destroy(UTILS.Messages.getCallbacks("Security group "+ sg.get("name") + " deleted.", "Error deleting security group "+sg.get("name")));
                        });
                    }
                });
                subview.render();
            break;
        }
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.tableView.close();
    },

    renderFirst: function () {
        this.undelegateEvents();
        var that = this;
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#securityGroups-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();

    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }
});