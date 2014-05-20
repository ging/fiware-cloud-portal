var BlueprintTemplateView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplateTemplate').html()),

    tableView: undefined,

    initialize: function() {
        var regions = UTILS.GlobalModels.get("loginModel").get("regions");
        this.options.flavors = {};
        this.options.images = {};
                //this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.options.securityGroupsModel = UTILS.GlobalModels.get("securityGroupsModel");
        //this.options.images = UTILS.GlobalModels.get("images");
        this.options.loginModel = UTILS.GlobalModels.get("loginModel");
        if (this.model) {
            this.model.unbind("sync");
            this.model.bind("sync", this.render, this);
        }
        this.model.fetch();
        this.renderFirst();
        for (var idx in regions) {
            var region = regions[idx];
            var images = new Images();
            var flavors = new Flavors();
            images.region = region;
            flavors.region = region;
            images.fetch({success: this.render});
            flavors.fetch({success: this.render});
            this.options.flavors[region] = flavors;
            this.options.images[region] = images;
        }
    },

    events: {
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        var main_buttons = [];
        if (JSTACK.Keystone.getservice("network") !== undefined) {
            main_buttons.push({label: "Topology", action: "show_nets"});
        }

        main_buttons.push({label: "Add Tier", action: "add"});
        return main_buttons;
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

    getActionButtons: function() {
        return [{
            icon: "fi-icon-edit",
            action: "edit"
            }, {
            icon: "fi-icon-delete",
            action: "delete"
            }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
        for (var index in this.model.get('tierDtos_asArray')) {
            var tier = this.model.get('tierDtos_asArray')[index];
            var region = tier.region;
            var products = [];
            for (var p in tier.productReleaseDtos_asArray) {
                products.push(tier.productReleaseDtos_asArray[p].productName + " " + tier.productReleaseDtos_asArray[p].version);
            }

            if (tier.keypair.toString() === "[object Object]") {
                tier.keypair = "-";
            }
            var image = "-";
            if (this.options.images[region].get(tier.image) !== undefined) {
                image = this.options.images[region].get(tier.image).get("name");
            }
            var entry = {
                id: tier.name,
                minValue: tier.minimumNumberInstances,
                maxValue: tier.maximumNumberInstances,
                bootValue: tier.initialNumberInstances,
                name: tier.name,
                icono: tier.icono,
                flavor: this.options.flavors[region].get(tier.flavour) ? this.options.flavors[region].get(tier.flavour).get("name") : "-",
                image: image,
                keypair: tier.keypair,
                publicIP: tier.floatingip,
                region: tier.region,
                products: products
            };
            entries.push(entry);
        }
        function compare(a,b) {
          if (a.id < b.id)
             return -1;
          if (a.id > b.id)
            return 1;
          return 0;
        }

        entries.sort(compare);
        return entries;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.tableView.close();
    },

    onAction: function(action, tierIds) {
        var tier, tr, subview;
        var self = this;
        if (tierIds.length === 1) {
            tier = tierIds[0];
            this.model.get('tierDtos_asArray').forEach(function(cur) {
                if (cur.name === tier) {
                    tr = cur;
                }
            });
        }
        switch (action) {
            case 'show_nets':
                subview = new MatrixNetView({el: 'body', model: self.model});
                subview.render();

                break;
            case 'add':

                subview = new EditTierView({el: 'body', model: self.model, securityGroupsModel: self.options.securityGroupsModel, regions: self.options.loginModel.get("regions"), callback: function () {
                    self.model.fetch({success: function () {
                        self.render();
                    }});
                }});
                subview.render();

                break;
            case 'edit':

                subview = new EditTierView({el: 'body', model: self.model, tier: tr, securityGroupsModel: self.options.securityGroupsModel, regions: self.options.loginModel.get("regions"), callback: function () {
                    self.model.fetch({success: function () {
                        self.render();
                    }});
                }});
                subview.render();

                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Tier",
                    btn_message: "Delete Tier",
                    onAccept: function() {
                        tierIds.forEach(function(tier) {
                            var options = UTILS.Messages.getCallbacks("Tier deleted", "Error deleting Tier.");
                            options.tier = tier;
                            var cb = options.callback;
                            options.callback = function() {
                                setTimeout(function() {
                                    self.model.fetch({success: function () {
                                        self.render();
                                    }});
                                }, 1000);
                                cb();
                            };
                            self.model.deleteTier(options);
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
            el: '#blueprint-template-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getActionButtons: this.getActionButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this,
            color: "#0093C6",
            color2: "#0093C6"
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
