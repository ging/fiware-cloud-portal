var BlueprintInstanceView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstanceTemplate').html()),

    tableView: undefined,
    sdcs: {},

    initialize: function() {
        var regions = UTILS.GlobalModels.get("loginModel").get("regions");
        this.options.flavors = {};
        this.options.images = {};
        var self = this;
        var render = function() {
            self.render.apply(self);
        };
        for (var idx in regions) {
            var region = regions[idx];
            var images = new Images();
            var flavors = new Flavors();
            images.region = region;
            flavors.region = region;
            images.fetch({success: render});
            flavors.fetch({success: render});
            this.options.flavors[region] = flavors;
            this.options.images[region] = images;
        }
        //this.options.images = UTILS.GlobalModels.get("images");
        //this.options.flavors = UTILS.GlobalModels.get("flavors");
        if (this.model) {
            this.model.unbind("sync");
            this.model.bind("sync", this.render, this);
        }
        this.model.fetch();
        this.renderFirst();
    },

    events: {
        'click .btn-launch': 'onLaunch'
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{label: "Back to instances", url: "#nova/blueprints/instances/"}];
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

    getActionButtons: function() {
        return [{
            icon: "fi-icon-play",
            action: "play"
            }, {
            icon: "fi-icon-instances",
            action: "show-instances"
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
        for (var index in this.model.get('tierDto_asArray')) {
            var tier = this.model.get('tierDto_asArray')[index];

            var products = [];
            var region = tier.region;
            for (var p in tier.productReleaseDtos_asArray) {
                products.push(tier.productReleaseDtos_asArray[p].productName + " " + tier.productReleaseDtos_asArray[p].version);
            }

            var currTiers = 0;
            if (tier.tierInstancePDto_asArray) {
                currTiers = tier.tierInstancePDto_asArray.length;
            }
            if (tier.keypair.toString() === "[object Object]") {
                tier.keypair = "-";
            }
            var image = "-";
            if (this.options.images[region] && this.options.images[region].get(tier.image) !== undefined) {
                image = this.options.images[region].get(tier.image).get("name");
            }
            var flavor = "-";
            if (this.options.flavors[region]) {
                flavor = this.options.flavors[region].get(tier.flavour) ? this.options.flavors[region].get(tier.flavour).get("name") : "-";
            }
            var entry = {
                id: tier.name,
                minValue: tier.minimumNumberInstances,
                maxValue: tier.maximumNumberInstances,
                currentValue: currTiers,
                icono: tier.icono,
                bootValue: tier.initialNumberInstances,
                name: tier.name,
                flavor: flavor,
                image: image,
                keypair: tier.keypair,
                publicIP: tier.floatingip,
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
            tr = tier;
        }
        //console.log(tierIds);
        switch (action) {
            case 'show-instances':
                window.location.href = "#nova/blueprints/instances/"+self.model.get("blueprintName")+"/tiers/"+tier+"/instances";
                break;
            case 'edit':
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableTiersView({
            model: this.model,
            el: '#blueprint-instance-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getActionButtons: this.getActionButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this,
            color: "#0093C6",
            color2: "#DDD"
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
