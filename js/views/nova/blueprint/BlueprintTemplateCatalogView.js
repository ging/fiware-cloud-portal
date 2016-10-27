var BlueprintTemplateCatalogView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplateCatalogTemplate').html()),

    tableView: undefined,
    bpTemplate: {},

    initialize: function() {

        var self = this;
        
        this.model.getCatalogBlueprint({id: this.options.templateId, callback: function (bpTemplate) {
            self.bpTemplate = bpTemplate;
            self.render();
        }, error: function (e) {
            console.log('Error getting catalog bp detail');
        }});

        this.options.flavors = {};
        this.options.images = {};

        this.renderFirst();
    },

    events: {
        'click .btn-launch': 'onLaunch'
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{label: "Back to Catalog", url: "#nova/blueprints/catalog/", cssclass: "btn-catalog"}];
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
        var self = this;
        var render = function() {
            self.render.apply(self);
        };
        var entries = [];
        var i = 0;
        for (var index in this.bpTemplate.tierDtos_asArray) {
            var tier = this.bpTemplate.tierDtos_asArray[index];

            var products = [];
            for (var p in tier.productReleaseDtos_asArray) {
                products.push(tier.productReleaseDtos_asArray[p].productName + " " + tier.productReleaseDtos_asArray[p].version);
            }

            var region = tier.region;

            var image = "Loading...";
            if (!this.options.images[region]) {
                var images = new Images();
                images.region = region;
                this.options.images[region] = images;
                images.fetch({success: render});
                
            } else if (this.options.images[region].get(tier.image)){
                image = this.options.images[region].get(tier.image).get("name");
            }

            var flavor = "Loading...";
            if (!this.options.flavors[region]) {
                var flavors = new Flavors();
                flavors.region = region;
                this.options.flavors[region] = flavors;
                flavors.fetch({success: render});
            } else if (this.options.flavors[region].get(tier.flavour)) {
                flavor = this.options.flavors[region].get(tier.flavour).get("name");
            }

            var entry = {
                id: tier.name,
                minValue: tier.minimumNumberInstances,
                maxValue: tier.maximumNumberInstances,
                bootValue: tier.initialNumberInstances,
                name: tier.name,
                flavor: flavor,
                image: image,
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
        $(this.el).html('<p style="padding:50px;">Loading...</p>');
    },

    render: function() {
        $('#page-title').children().html('Blueprint Templates / Catalog / ' + this.bpTemplate.name);
        if (this.tableView === undefined) {
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
        } 
        this.tableView.render();
    }

});