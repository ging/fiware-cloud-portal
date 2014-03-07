var CreateSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#createSubnetFormTemplate').html()),

    events: {
      'click #cancelBtn-subnet': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'create'
    },

    initialize: function() {
    },

    render: function () {
        if ($('#create_subnet').html() != null) {
            return;
        }
        $(this.el).append(this._template({tenant_id: this.options.tenant_id, network_id: this.options.network_id}));
        $('#create_subnet').modal();
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
        $('#create_subnet').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
    },

    create: function(e) {
        var self = this;
        var network_id = this.options.network_id;
        
        var subnet = new Subnet();
        var tenant_id = this.options.tenant_id;
        var subnet_name = $('input[name=subnet_name]').val();
        var cidr = $('input[name=network_address]').val();
        //var ip_version = $('select[name=ip_version]').val();
        var gateway_ip = $('input[name=gateway_ip]').val();

        var enable_dhcp = this.$('input[name=enable_dhcp]').is(':checked');
        var allocation_pools = $('textarea[name=allocation_pools]').val();
        var dns_name_servers = $('textarea[name=dns_name_servers]').val();
        var host_routes = $('textarea[name=host_routes]').val();

        subnet.set({'network_id': network_id});    
        subnet.set({'cidr': cidr});
        subnet.set({'ip_version': '4'});
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

        if (host_routes !== "") {
            var hosts = [];
            var lines1 = host_routes.split('\n');
            for (var l1 in lines1) {
                var host = {destination: lines1[l1].split(',')[0], nexthop: lines1[l1].split(',')[1]};
                hosts.push(host);
            }
            subnet.set({'host_routes': hosts});
        }

        //console.log('CON SUBNET', subnet.attributes);
                 
        subnet.save(undefined, UTILS.Messages.getCallbacks("Subnet " + subnet_name + " created.", "Error creating subnet " + subnet_name, {context: self, success: self.options.success_callback}));   
    }       
});