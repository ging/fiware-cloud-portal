var CreateNetworkView = Backbone.View.extend({

    _template: _.itemplate($('#createNetworkFormTemplate').html()),

    events: {
      'click #cancelBtn-network': 'close',
      'click #network' : 'networkTab',
      'click #subnet' : 'subnetTab',
      'click #details' : 'subnetDetailTab',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'create'
    },

    initialize: function() {
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

    networkTab: function(e) {
        if ($('#input_subnet').show()) {
            $('#input_subnet').hide();
        } 
        if ($('#input_network').hide()) {
            $('#input_network').show();
        }  
        if ($('#input_subnet_detail').show()) {
            $('#input_subnet_detail').hide();
        }  
    },

    subnetTab: function(e) {
        if ($('#input_subnet').hide()) {
            $('#input_subnet').show();
        } 
        if ($('#input_network').show()) {
            $('#input_network').hide();
        }  
        if ($('#input_subnet_detail').show()) {
            $('#input_subnet_detail').hide();
        }       
    },

    subnetDetailTab: function(e) {
        if ($('#input_subnet').show()) {
            $('#input_subnet').hide();
        } 
        if ($('#input_network').show()) {
            $('#input_network').hide();
        }  
        if ($('#input_subnet_detail').hide()) {
            $('#input_subnet_detail').show();
        }  
    },

    create: function(e) {
        
        var self = this;
        var network = new Network();
        var name = $('input[name=network]').val();
        var admin_state = this.$('input[name=admin_state]').is(':checked');
        var subnet = new Subnet();
        var create_subnet = this.$('input[name=create_subnet]').is(':checked');
        var tenant_id = this.options.tenant_id;
        var subnet_name = $('input[name=subnet_name]').val();
        var cidr = $('input[name=network_address]').val();
        var ip_version = $('input[name=ip_version]').val();
        var gateway_ip = $('input[name=gateway_ip]').val();
        var disable_gateway = this.$('input[name=disable_gateway]').is(':checked');

        var enable_dhcp = this.$('input[name=enable_dhcp]').is(':checked');
        var allocation_pools = $('input[name=allocation_pools]').val();
        var dns_name_servers = $('input[name=dns_name_servers]').val();
        var host_routers = $('input[name=host_routers]').val();

        network.set({'name': name});
        network.set({'admin_state_up': admin_state});

        if (create_subnet) {
            subnet.set({'name': subnet_name});
            subnet.set({'name': subnet_name});
            subnet.set({'cidr': cidr});
            subnet.set({'ip_version': ip_version});
            subnet.set({'tenant_id': tenant_id});
            subnet.set({'enable_dhcp': enable_dhcp});
            subnet.set({'allocation_pools': allocation_pools});
            subnet.set({'dns_nameservers': dns_name_servers});
            subnet.set({'host_routers': host_routers});    
     

            if (cidr !== "") {

                if (disable_gateway === false && gateway_ip !== "") {
                    subnet.set({'gateway_ip': gateway_ip});
                    network.save(undefined, {success: function(model, response) {     
                    var network_id = model.attributes.network.id; 
                    subnet.set({'network_id': network_id});              
                    subnet.save(undefined, UTILS.Messages.getCallbacks("Network "+network.get("name") + " created.", "Error creating network "+network.get("name"), {context: self}));   
                    }, error: function(response) {
                        console("error", response);
                    }});  
                } else if (disable_gateway === true) {
                    network.save(undefined, {success: function(model, response) {     
                    var network_id = model.attributes.network.id; 
                    subnet.set({'network_id': network_id});              
                    subnet.save(undefined, UTILS.Messages.getCallbacks("Network "+network.get("name") + " created.", "Error creating network "+network.get("name"), {context: self}));   
                    }, error: function(response) {
                        console("error", response);
                    }});   
                }

            } else {
                // cidr is empty
                if ($('#input_network').show()) {
                    $('#input_network').hide();
                    $('#input_subnet_detail').hide();
                    $('#input_subnet').show();
                    $('#myTab a[href="#input_subnet"]').tab('show');

                } else if ($('#input_subnet_detail').show()) {
                    $('#input_subnet_detail').hide();
                    $('#input_network').hide();
                    $('#input_subnet').show();
                    $('#myTab a[href="#input_subnet"]').tab('show');
                }
                
            }         

        } else {
            network.save(undefined, UTILS.Messages.getCallbacks("Network "+network.get("name") + " created.", "Error creating network "+network.get("name"), {context: self})); 
        }             

        
    }
});