var BlueprintInstanceView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstanceTemplate').html()),

    tableView: undefined,
    sdcs: {},

    initialize: function() {
        //console.log('iii', this.model);
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
            if (this.options.images.get(tier.image) !== undefined) {
                image = this.options.images.get(tier.image).get("name");
            }
            var entry = {
                id: tier.name,
                minValue: tier.minimumNumberInstances,
                maxValue: tier.maximumNumberInstances,
                currentValue: currTiers,
                icono: tier.icono,
                bootValue: tier.initialNumberInstances,
                name: tier.name,
                flavor: this.options.flavors.get(tier.flavour) ? this.options.flavors.get(tier.flavour).get("name") : "-",
                image: image,
                keypair: tier.keypair,
                publicIP: tier.floatingip,
                products: products
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
