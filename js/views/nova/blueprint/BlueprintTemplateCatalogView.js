var BlueprintTemplateCatalogView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplateCatalogTemplate').html()),

    tableView: undefined,
    sdcs: {},
    bpTemplate: {},

    initialize: function() {

        var self = this;
        this.model.getCatalogBlueprint({id: this.options.templateId, callback: function (bpTemplate) {
            self.bpTemplate = bpTemplate;
            self.renderFirst();
        }, error: function (e) {
            console.log('Error getting catalog bp detail');
        }});

    },

    events: {
        'click .btn-launch': 'onLaunch'
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{label: "Back Catalog", url: "#nova/blueprints/catalog/", cssclass: "btn-catalog"}];
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
        for (var index in this.bpTemplate.tierDtos_asArray) {
            var tier = this.bpTemplate.tierDtos_asArray[index];

            var products = [];
            for (var p in tier.productReleaseDtos_asArray) {
                products.push(tier.productReleaseDtos_asArray[p].productName);
            }

            var entry = {
                id: tier.name,
                minValue: tier.minimum_number_instances,
                maxValue: tier.maximum_number_instances,
                bootValue: tier.initial_number_instances,
                name: tier.name,
                flavor: tier.flavour,
                image: tier.image,
                products: products,
                icon: tier.icono
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
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableTiersView({
            model: this.model,
            el: '#blueprint-templateCatalog-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this,
            color: "#95C11F",
            color2: "#95C11F"
        });
        this.tableView.render();
    }


});