var NeutronRoutersView = Backbone.View.extend({

    _template: _.itemplate($('#neutronRoutersTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.options.networks.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.options.networks.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        return [{
            label: "Create Router",
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
        var gatewayUnSet= function(size, ids) {
            if (size === 1) {
                
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("external_gateway_info") === null) {
                        return true;
                    }
                }
 
            } else {
                return false;
            }
        };
        var gatewaySet= function(size, ids) {
            if (size === 1) {
                
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("external_gateway_info") !== null) {
                        return true;
                    }
                }
     
            } else {
                return false;
            }
        };
        return [{
            label: "Set Gateway",
            action: "set_gateway",
            activatePattern: gatewayUnSet
        }, {
            label: "Clear Gateway",
            action: "clear_gateway",
            warn: true,
            activatePattern: gatewaySet
        }, {
            label: "Delete Routers",
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
            tooltip: "Routers's name",
            size: "30%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the router",
            size: "25%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "External Network",
            tooltip: "Connected External Network",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var networks = this.options.networks.models;
        var current_tenant_id = this.options.tenant_id;
        var entries = [];       
        var external_network; 
        for (var index in this.model.models) {
            var router = this.model.models[index];
            var tenant_id = router.get('tenant_id');
            if (current_tenant_id == tenant_id) {  
                for (var i in networks) {
                    var network_id = networks[i].get('id');
                    if (router.get('external_gateway_info') === null) {
                        external_network = '-';
                    } else if (network_id === router.get('external_gateway_info').network_id) {
                        external_network = networks[i].get('name');
                    }
                }        
                var entry = {
                        id: router.get('id'),
                        cells: [{
                            value: router.get('name'),
                            link: "#neutron/routers/" + router.get('id')
                        }, {
                            value: router.get('status') 
                        }, {  
                            value: external_network
                        }]
                    };
                entries.push(entry);
            }
        }
        return entries;
    },

    onAction: function(action, routerIDs) {
        var router, rout, subview;
        var self = this;
        if (routerIDs.length === 1) {
            router = routerIDs[0];
            rout = this.model.get(router);
        }
        switch (action) {
            case 'create':
                subview = new CreateRouterView({
                    el: 'body',
                    model: this.model,
                    tenant_id: this.options.tenant_id
                });
                subview.render();
                break;
            case 'set_gateway':
                subview = new EditRouterView({
                    el: 'body',
                    model: rout,
                    networks: this.options.networks
                });
                subview.render();
                break;
            case 'clear_gateway':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Clear Gateway",
                    btn_message: "Clear Gateway",
                    onAccept: function() {
                        routerIDs.forEach(function(router) {
                            rout = self.model.get(router);
                            rout.set({'external_gateway_info:network_id': undefined});
                            rout.save(undefined, UTILS.Messages.getCallbacks("Gateway removed: "+rout.get("name"), "Failed to remove gateway: "+rout.get("name")), {context: this});                       
                        });
                    }
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Delete Router",
                    btn_message: "Delete Router",
                    onAccept: function() {
                        routerIDs.forEach(function(router) {
                            rout = self.model.get(router);
                            rout.destroy(UTILS.Messages.getCallbacks("Router "+rout.get("name") + " deleted.", "Error deleting router "+rout.get("name"), {context: self}));                       
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
            models: this.model.models, tenant_id: this.options.tenant_id, networks: this.options.networks
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#routers-table',
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