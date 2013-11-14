var CreateSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#createSubnetFormTemplate').html()),

    events: {
      'click #cancelBtn-subnet': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'click #subnet' : 'subnetTab',
      'click #details' : 'subnetDetailTab',
      'submit #form': 'create',
      'click #create_subnet_button': 'create'
    },

    initialize: function() {
    },

    render: function () {
        if ($('#create_subnet').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, tenant_id: this.options.tenant_id, network_id: this.options.network_id}));
        $('#create_subnet').modal();
        return this;
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
        this.model.unbind("sync", this.render, this);
    },

    create: function(e) {
        var network_id = this.options.network_id;
        console.log(network_id);
        var subnet = new Subnet();
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

        subnet.set({'network_id': network_id});
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
                subnet.save(undefined, {success: function(model, response) {
                    UTILS.Messages.getCallbacks("Subnet "+subnet.get("name") + " created.", "Error creating subnet "+subnet.get("name"), {context: this});   
                }, error: function(response) {
                    console.log("error", response);
                }});  
                this.close();  
            } else if (disable_gateway === true) {
                    subnet.save(undefined, {success: function(model, response) {
                    UTILS.Messages.getCallbacks("Subnet "+subnet.get("name") + " created.", "Error creating subnet "+subnet.get("name"), {context: this});   
                }, error: function(response) {
                    console.log("error", response);
                }});  
                this.close();
            }
            //error msg: Failed to create subnet "2.2.2.2/24" for network "None": Invalid input for operation: Requested subnet with cidr: 2.2.2.2/24 for network: 3d4a5f9b-24ca-431a-a691-c483b419f405 overlaps with another subnet.
        }
    }       
});