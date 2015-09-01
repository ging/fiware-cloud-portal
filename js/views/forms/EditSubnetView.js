var EditSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#editSubnetFormTemplate').html()),

    events: {
        'click #update_subnet_button': 'onUpdate',
        'click #cancelBtn-subnet': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        $('#edit_subnet').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
    },

    render: function () {
        if ($('#edit_subnet').html() != null) {
            $('#edit_subnet').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var self = this;
        
        var subnet = this.model;
        var subnet_name = $('input[name=subnet_name]').val();
        //var ip_version = $('select[name=ip_version]').val();
        var gateway_ip = $('input[name=gateway_ip]').val();

        var enable_dhcp = this.$('input[name=enable_dhcp]').is(':checked');
        var dns_name_servers = $('textarea[name=dns_name_servers]').val();
        var host_routes = $('textarea[name=host_routes]').val();

        subnet.set({'enable_dhcp': enable_dhcp});

        if (subnet_name !== "") subnet.set({'name': subnet_name});
        if (gateway_ip !== "") subnet.set({'gateway_ip': gateway_ip});

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
        } else {
            subnet.set({'host_routes': []});
        }

        console.log('CON SUBNET', subnet.attributes);
                 
        subnet.save(undefined, UTILS.Messages.getCallbacks("Subnet " + subnet_name + " updated.", "Error updating subnet " + subnet_name, {context: self, success: self.options.success_callback}));
    }

});