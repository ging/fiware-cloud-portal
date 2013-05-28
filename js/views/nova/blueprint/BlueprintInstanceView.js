var BlueprintInstanceView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstanceTemplate').html()),

    tableView: undefined,
    sdcs: {},

    initialize: function() {
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
        for (var index in this.model.get('tierInstanceDtos_asArray')) {
            var tier = this.model.get('tierInstanceDtos_asArray')[index];

            var products = [];
            for (var p in tier.productInstanceDtos_asArray) {
                products.push(tier.productInstanceDtos_asArray[p].productReleaseDto.productName);
            }
            var entry = {
                id: tier.tierInstanceName,
                minValue: tier.tierDto.minimumNumberInstances,
                maxValue: tier.tierDto.maximumNumberInstances,
                currentValue: tier.replicaNumber,
                currentValue: 1,
                icono: tier.tierDto.icono,
                bootValue: tier.tierDto.initialNumberInstances,
                name: tier.tierDto.name,
                flavor: this.options.flavors.get(tier.tierDto.flavour).get("name"),
                image: this.options.images.get(tier.tierDto.image).get("name"),
                keypair: tier.tierDto.keypair,
                publicIP: tier.tierDto.floatingip,
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
        console.log(tierIds);
        switch (action) {
            case 'show-instances':
                window.location.href = "#nova/blueprints/instances/"+self.model.get("name")+"/tiers/"+tier+"/instances";
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