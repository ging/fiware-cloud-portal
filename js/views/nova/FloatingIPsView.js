var NovaFloatingIPsView = Backbone.View.extend({

    _template: _.itemplate($('#novaFloatingIPsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Allocate IP to Project",
            action: "allocate"
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
            label: "Release Floating IPs",
            action: "release",
            activatePattern: groupSelected
        }];
    },

    getHeaders: function() {
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "IP Address",
            tooltip: "IP Address",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Instance",
            tooltip: "Instance the IP is attached to",
            size: "35%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Floating IP Pool",
            tooltip: "Corresponding Floating Pool",
            size: "35%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        return entries;
    },

    onClose: function() {
        this.tableView.close();
        this.model.bind("change", this.onInstanceDetail, this);
        this.unbind();
        this.undelegateEvents();
    },

    onAction: function(action, floatingIds) {
        var floating, floa, subview;
        var self = this;
        if (floatingIds.length === 1) {
            floating = floatingIds[0];
            floa = this.model.get(floating);
        }
        switch (action) {
            case 'allocate':
                subview = new AllocateIPView({el: 'body',  model: this.model});
                subview.render();
            break;
            case 'release':
                subview = new ConfirmView({el: 'body', title: "Release Floating IP", btn_message: "Release Floating IPs", onAccept: function() {
                    var subview2 = new MessagesView({state: "Success", title: "Floating IPs "+floa.get(name)+" released."});
                    subview2.render();
                }});
                subview.render();
            break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#floatingIPs-table',
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