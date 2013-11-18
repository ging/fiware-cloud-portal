var NeutronNetworksView = Backbone.View.extend({

    _template: _.itemplate($('#neutronNetworksTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.options.subnets.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.options.subnets.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        return [{
            label: "Create Network",
            action: "create"
        }];
    },

    getDropdownButtons: function() {
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
            label: "Edit Network",
            action: "update",
            activatePattern: oneSelected
        }, {
            label: "Add Subnet",
            action: "add_subnet",
            activatePattern: oneSelected
        }, {
            label: "Delete Networks",
            action: "delete",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getHeaders: function() {
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "Network's name",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Subnets associated",
            tooltip: "Subnets that are associated to this network",
            size: "30%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Shared",
            tooltip: "If the network is shared",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the network",
            size: "15",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Admin State",
            tooltip: "State of the network",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var all_subnets = this.options.subnets.models;
        var current_tenant_id = this.options.tenant_id;
        var entries = [];        
        for (var index in this.model.models) {
            var subnets = [];
            var network = this.model.models[index];
            var tenant_id = network.get('tenant_id');
            var subnet_ids = network.get('subnets');
            if (current_tenant_id == tenant_id) {
                for (var i in subnet_ids) {
                    sub_id = subnet_ids[i];
                    for (var j in all_subnets) {
                        if (sub_id == all_subnets[j].get('id')) {
                            var sub_cidr = all_subnets[j].get('name')+" "+all_subnets[j].get('cidr');
                            subnets.push(sub_cidr);
                        }                                      
                    }                    
                }            
                var entry = {
                        id: network.get('id'),
                        cells: [{
                            value: network.get('name') === "" ? "("+network.get("id").slice(0,8)+")" : network.get('name'),
                            link: "#neutron/networks/" + network.get('id')
                        }, {
                            value: subnets
                        }, {
                            value: network.get('shared') ? "Yes" : "No"
                        }, {  
                            value: network.get('status')
                        },  {  
                            value: network.get('admin_state_up') ? "UP" : "DOWN"
                        }]
                    };
                entries.push(entry);
            }
        }
        return entries;
    },

    onAction: function(action, networkIDs) {
        var network, net, subview;
        var self = this;
        if (networkIDs.length === 1) {
            network = networkIDs[0];
            net = this.model.get(network);
            this.options.network_id = network;
        }
        switch (action) {
            case 'create':
                subview = new CreateNetworkView({
                    el: 'body',
                    model: this.model,
                    subnets: this.options.subnets,
                    tenant_id: this.options.tenant_id
                });
                subview.render();
                break;
            case 'add_subnet':
                subview = new CreateSubnetView({
                    el: 'body',
                    model: this.model,
                    tenant_id: this.options.tenant_id, 
                    network_id: this.options.network_id
                });
                subview.render();
                break;
            case 'update':
                subview = new EditNetworkView({
                    el: 'body',
                    model: net
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Delete Network",
                    btn_message: "Delete Network",
                    onAccept: function() {
                        networkIDs.forEach(function(network) {
                            net = self.model.get(network);
                            net.destroy(UTILS.Messages.getCallbacks("Network "+net.get("name") + " deleted.", "Error deleting network "+net.get("name"), {context: self}));                       
                        });
                    }
                });
                subview.render();
                break;
        }
    },
   
    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models, tenant_id: this.options.tenant_id, subnets: this.options.subnets
        });
        this.tableView = new TableView({
            model: this.model,
            subnets: this.options.subnets,
            el: '#networks-table',
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