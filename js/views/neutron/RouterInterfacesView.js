var RouterInterfacesView = Backbone.View.extend({

    _template: _.itemplate($('#routerInterfacesTemplate').html()),

    tableView: undefined,

    initialize: function() {
        var self = this;
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.options.ports.unbind("sync");
        this.options.ports.bind("sync", this.render, this);
        this.model.fetch({success: function() {
            self.renderFirst();
        }});
    },

    getMainButtons: function() {
        return [{
            label: "Add Interface",
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
            label: "Delete Interface",
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
            tooltip: "Name/ID of the interface (port)",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Fixed IPs",
            tooltip: "IP addresses for the port. Includes the IP address and subnet ID.",
            size: "30%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "The status of the port: UP or DOWN.",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Type",
            tooltip: "Type (Internal Interface/External Gateway)",
            size: "30%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Admin State",
            tooltip: "Administrative state of the router. (UP or DOWN)",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var subnets = this.options.subnets.models;  
        var ports = this.options.ports.models;   
        var router_id = this.model.get('id');  
        var entries = [];
        //console.log('va ', ports, router_id);
        for (var index in ports) {
            var fixed_ips = [];
            var port = ports[index];
            var port_device_id = port.get("device_id");
            if (port_device_id == router_id) {
                //if (port.get('device_owner') == 'network:router_interface' || port.get('device_owner') == 'network:router_gateway') {
                    f_ips = port.get('fixed_ips');
                    for (var i in f_ips) {
                        fixed_ips.push(f_ips[i].ip_address);
                    } 
                    var entry = {
                            id: port.get('id'),
                            cells: [{
                                value: port.get('name') === "" ? "("+port.get('id').slice(0,8)+")" : port.get('name'),
                                link: "#neutron/networks/ports/" + port.get('id')
                            }, {
                                value: fixed_ips
                            }, {  
                                value: port.get('status')
                            },  {  
                                //value: port.get('device_owner') == 'network:router_interface' ? "Internal Interface" : "External Gateway"
                                value: port.get('device_owner').substring(8)
                            },  {  
                                value: port.get('admin_state_up') ? "UP" : "DOWN"
                            }]
                        };
                    entries.push(entry);
               //}
            }
        }
        return entries;
    },

    onAction: function(action, portIDs) {
        var port, po, subview;
        var self = this;
        if (portIDs.length === 1) {
            port = portIDs[0];
        }
        switch (action) {
            case 'create':
                subview = new AddInterfaceToRouterView({
                    el: 'body',
                    model: this.model,
                    subnets: this.options.subnets,
                    networks: this.options.networks,
                    tenant_id: this.options.tenant_id
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Delete Interface",
                    btn_message: "Delete Interface",
                    onAccept: function() {
                        portIDs.forEach(function(port) {
                            var interf = self.options.ports.get(port);
                            var router_id = self.model.get('id');
                            self.model.removeinterfacefromrouter(router_id, port, UTILS.Messages.getCallbacks("Interface "+interf.get('name') + " deleted.", "Error deleting interface "+interf.get('name'), {context: self}));                          
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
            model: this.model, subnets: this.options.subnets, networks: this.options.networks, ports: this.options.ports, tenant_id: this.options.tenant_id
        });
        this.tableView = new TableView({
            model: this.model,
            subnets: this.options.subnets,
            networks: this.options.networks,
            ports: this.options.ports,
            el: '#interfaces',
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
        if ($(this.el).html() !== null  && this.tableView !== undefined) {
            this.tableView.render();
        }
        return this;
    }
});