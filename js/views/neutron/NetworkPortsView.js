var NetworkPortsView = Backbone.View.extend({

    _template: _.itemplate($('#networkPortsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        var self = this;
        this.model.unbind("sync");
        this.model.bind("sync", self.render, this);
        this.model.fetch({success: function() {
            self.renderFirst();
        }});
    },

    getMainButtons: function() {
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
            label: "Edit Port",
            action: "update",
            activatePattern: oneSelected
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "The name of the port.",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Fixed IPs",
            tooltip: "IP addresses for the port. Includes the IP address and subnet ID.",
            size: "25%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Attached Device",
            tooltip: "The ID of the entity that uses this port. For example, a dhcp agent.",
            size: "30%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "The status of the port: UP or DOWN.",
            size: "15",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Admin State",
            tooltip: "Administrative state of the router. (UP or DOWN)",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {   
        var network_id = this.model.id;
        var ports = this.options.ports.models;           
        var entries = [];       
        for (var index in ports) {
            var fixed_ips = [];
            var port = ports[index];
            var net_id = port.attributes.network_id;
            var port_id = port.get("id");
            var port_name = port_id.slice(0,8);
            if (net_id === network_id) {
                f_ips = port.attributes.fixed_ips;
                for (var i in f_ips) {
                    fixed_ips.push(f_ips[i].ip_address);
                } 
                var entry = {
                        id: port.attributes.id,
                        cells: [{
                            value: port.attributes.name === "" ? "("+port_name+")" : port.attributes.name,
                            link: "#neutron/networks/ports/" + port.attributes.id
                        }, {
                            value: fixed_ips
                        }, {  
                            value: port.attributes.device_owner === "" ? "Detached" : port.attributes.device_owner
                        },  {  
                            value: port.attributes.status
                        },  {  
                            value: port.attributes.admin_state_up ? "UP" : "DOWN"
                        }]
                    };
                entries.push(entry); 
            }    
        }          
        return entries;
    },

    onAction: function(action, portIDs) {
        var port, po, subview;
        var self = this;
        if (portIDs.length === 1) {
            po = portIDs[0];
            port = this.options.ports.get(po);
            console.log(port);
        }
        switch (action) {
            case 'update':
                subview = new EditPortView({
                    el: 'body',
                    model: port
                });
                subview.render();
                break;
            case 'update':
                break;
            default:
                break;
        }
    },

    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {
            model: this.model, ports: this.options.ports
        });
        this.tableView = new TableView({
            model: this.model,
            ports: this.options.ports,
            el: '#ports',
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
        if ($(this.el).html() !== null && this.tableView !== undefined) {
            this.tableView.render();
        }
        return this;
    }
});