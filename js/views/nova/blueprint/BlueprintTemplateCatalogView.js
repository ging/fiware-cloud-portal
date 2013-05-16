var BlueprintTemplateCatalogView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplateTemplate').html()),

    tableView: undefined,
    sdcs: {},

    initialize: function() {
        if (this.model) {
            this.model.unbind("sync");
            this.model.bind("sync", this.render, this);
        }
        this.renderFirst();
    },

    events: {
        'click .btn-launch': 'onLaunch'
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{label: "Add Tier", action: "add"}];
    },

    getDropdownButtons: function() {
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
            label: "Edit Tier",
            action: "edit",
            activatePattern: oneSelected
            }, {
            label: "Delete Tier",
            action: "delete",
            warn: true,
            activatePattern: groupSelected
            }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            name: "Graph",
            tooltip: "Graph",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Info",
            tooltip: "Template's info",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Software",
            tooltip: "Software in tier",
            size: "50%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
        this.model = {models:[{id:1},{id:2},{id:3}]};
        for (var index in this.model.models) {
            var template = this.model.models[index];
            i++;
            var entry = {
                id: template.id,
                minValue: 1,
                maxValue: 10,
                bootValue: 7,
                name: "test",
                flavor: "flavor",
                image: "image",
                keypair: "keypair",
                publicIP: "yes",
                products: ["uno", "dos"]
            };
            entries.push(entry);
        }
        return entries;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.tableView.close();
    },

    onAction: function(action, blueprintIds) {
        var blueprint, bp, subview;
        var self = this;
        if (blueprintIds.length === 1) {
            blueprint = blueprintIds[0];
            bp = blueprint;
        }
        switch (action) {
            case 'add':
                break;
            case 'edit':
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Tier",
                    btn_message: "Delete Tier",
                    onAccept: function() {
                        blueprintIds.forEach(function(blueprint) {
                            bp.destroy(UTILS.Messages.getCallbacks("Tier deleted", "Error deleting Tier."));
                        });
                    }
                });
                subview.render();
                break;
        }
    },

    renderFirst: function() {
        console.log("Rendering Blueprint Template");
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableTiersView({
            model: this.model,
            el: '#blueprint-template-table',
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