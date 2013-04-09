var InstanceSDCView = Backbone.View.extend({

    _template: _.itemplate($('#instanceSDCTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,

    initialize: function() {
        this.model.fetch();
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return []; 
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
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
        return [];
        // [{
        //     label: "Release Floating IPs",
        //     action: "release",
        //     activatePattern: groupSelected
        // }];
    },

    getHeaders: function() {
        return [{
            type: "checkbox",
            size: "10%"
        }, {
            name: "Name",
            tooltip: "Software name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Version",
            tooltip: "Software version",
            size: "25%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Available",
            tooltip: "Software availability",
            size: "25%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        return entries;
    },

    getMainButtonsNew: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return []; 
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
    },

    getDropdownButtonsNew: function() {
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
        return [];
        // [{
        //     label: "Release Floating IPs",
        //     action: "release",
        //     activatePattern: groupSelected
        // }];
    },

    getHeadersNew: function() {
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "Software name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Description",
            size: "55%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntriesNew: function() {
        var entries = [];

        if (this.model.models.length === 0) {
            return entries;
        }

        var products = this.model.models[0].attributes.product;

        for (var product in products) {
            entries.push({id:product, cells:[
                {value: products[product].name},
                {value: products[product].description}]});
        }
        return entries;

    },

    onClose: function() {
        this.tableView.close();
        this.tableViewNew.close();
        this.unbind();
        this.undelegateEvents();
    },

    onAction: function(action, ids) {
        // var floating, floa, subview;
        // var self = this;
        // if (floatingIds.length === 1) {
        //     floating = floatingIds[0];
        //     floa = this.model.get(floating);
        // }
        // switch (action) {
        //     case 'allocate':
        //         subview = new AllocateIPView({el: 'body',  model: this.model});
        //         subview.render();
        //     break;
        //     case 'release':
        //         subview = new ConfirmView({el: 'body', title: "Release Floating IP", btn_message: "Release Floating IPs", onAccept: function() {
        //             var subview2 = new MessagesView({state: "Success", title: "Floating IPs "+floa.get(name)+" released."});
        //             subview2.render();
        //         }});
        //         subview.render();
        //     break;
        // }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#installedSoftware-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });

        this.tableViewNew = new TableView({
            model: this.model,
            el: '#newSoftware-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtonsNew,
            getMainButtons: this.getMainButtonsNew,
            getHeaders: this.getHeadersNew,
            getEntries: this.getEntriesNew,
            context: this
        });

        this.tableView.render();
        this.tableViewNew.render();
    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
            this.tableViewNew.render();
        }
        return this;
    }
});