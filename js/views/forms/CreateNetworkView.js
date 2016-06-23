var CreateNetworkView = Backbone.View.extend({

    _template: _.itemplate($('#createNetworkFormTemplate').html()),

    events: {
      'click #cancelBtn-network': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'click #switch_subnet': 'switch_subnet',
      'submit #form': 'create'
    },

    initialize: function() {
        this.add_subnet = false;
    },

    render: function () {
        if ($('#create_network').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, subnets: this.options.subnets, tenant_id: this.options.tenant_id}));
        $('#create_network').modal();
        return this;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        $('#create_network').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    prefix_ip_version: function(cidr) {
	var cidr_ipv4 = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\/(3[012]|[012]?\d)$/i;
	var cidr_ipv6 = /^\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\/(1([01]\d|2[0-8])|\d\d?)$/i;
        if (cidr_ipv4.test(cidr)) {
            return 4;
        } else if (cidr_ipv6.test(cidr)) {
            return 6;
        }
    },

    switch_subnet: function(e) {
        if (this.add_subnet) {

            $('#subnet_details').addClass('hide');
            $('#switch_subnet').html('Add subnet');
            $('#network_modal').css('height', '140px');
            document.getElementById('network_address').removeAttribute('pattern');
            document.getElementById('network_address').removeAttribute('required');

            this.add_subnet = false;

        } else {

            $('#subnet_details').removeClass('hide');
            $('#switch_subnet').html('Remove subnet');
            $('#network_modal').css('height', '475px');

            var reg = new RegExp();
            $('#network_address').attr('pattern', '^((\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\/(3[012]|[012]?\\d)$|^\\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*\\/(1([01]\\d|2[0-8])|\\d\\d?)$');
            $('#network_address').attr('required', 'required');

            this.add_subnet = true;
        }
    },

    create: function(e) {
        
        var self = this;

        var network = new Network();
        var name = $('input[name=network]').val();
        var admin_state = this.$('input[name=admin_state]').is(':checked');
        
        network.set({'admin_state_up': admin_state});

        if (name !== "") network.set({'name': name});
        
        if (this.add_subnet) {

            var subnet = new Subnet();
            var tenant_id = this.options.tenant_id;
            var subnet_name = $('input[name=subnet_name]').val();
            var cidr = $('input[name=network_address]').val();
            var ip_version = self.prefix_ip_version(cidr);
            var gateway_ip = $('input[name=gateway_ip]').val();

            var enable_dhcp = this.$('input[name=enable_dhcp]').is(':checked');
            var allocation_pools = $('textarea[name=allocation_pools]').val();
            var dns_name_servers = $('textarea[name=dns_name_servers]').val();
            var host_routers = $('textarea[name=host_routers]').val();

            
            subnet.set({'cidr': cidr});
            subnet.set({'ip_version': ip_version});
            subnet.set({'tenant_id': tenant_id});
            subnet.set({'enable_dhcp': enable_dhcp});

            if (subnet_name !== "") subnet.set({'name': subnet_name});
            if (gateway_ip !== "") subnet.set({'gateway_ip': gateway_ip});

            if (allocation_pools !== "") {
                var pools = [];
                var lines = allocation_pools.split('\n');
                for (var l in lines) {
                    var pool = {start: lines[l].split(',')[0], end: lines[l].split(',')[1]};
                    pools.push(pool);
                }
                subnet.set({'allocation_pools': pools});
            }

            if (dns_name_servers !== "") {
                var dnss = dns_name_servers.split('\n');
                subnet.set({'dns_nameservers': dnss});
            }

            if (host_routers !== "") {
                var hosts = [];
                var lines1 = host_routers.split('\n');
                for (var l1 in lines1) {
                    var host = {destination: lines1[l1].split(',')[0], nexthop: lines1[l1].split(',')[1]};
                    hosts.push(host);
                }
                subnet.set({'host_routers': hosts});
            }

        
            //console.log('CON SUBNET', network.attributes, subnet.attributes);
           
            network.save(undefined, {success: function(model, response) {     
                var network_id = model.attributes.network.id; 
                subnet.set({'network_id': network_id});
                subnet.save(undefined, UTILS.Messages.getCallbacks("Network " + name + " created.", "Error creating network " + name, {context: self}));   
            }, error: function(response) {
                console.log("error", response);
            }});  

        } else {
            //console.log('NO SUBNET', network.attributes);
            network.save(undefined, UTILS.Messages.getCallbacks("Network " + name + " created.", "Error creating network " + name, {context: self})); 
        }             
    }
});
