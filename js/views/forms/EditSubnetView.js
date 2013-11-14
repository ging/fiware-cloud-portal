var EditSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#editSubnetFormTemplate').html()),

    events: {
        'click #update_subnet_button': 'onUpdate',
        'click #cancelBtn-subnet': 'close',
        'click #close': 'close',
        'click #subnet' : 'subnetTab',
        'click #details' : 'subnetDetailTab',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_subnet').remove();
        $('.edit-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
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

    render: function () {
        if ($('#edit_subnet').html() != null) {
            $('#edit_network').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model.attributes}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var subnet_name = $('input[name=subnet_name]').val();
        var gateway_ip = $('input[name=gateway_ip]').val();
        var disable_gateway = this.$('input[name=disable_gateway]').is(':checked');
        var enable_dhcp = this.$('input[name=enable_dhcp]').is(':checked');
        var dns_name_servers = $('input[name=dns_name_servers]').val();
        var host_routers = $('input[name=host_routers]').val();

        this.model.set({'name': subnet_name});
        this.model.set({'enable_dhcp': enable_dhcp});
        this.model.set({'dns_nameservers': dns_name_servers});
        this.model.set({'host_routers': host_routers});

        if (disable_gateway === false && gateway_ip !== "") {
            this.model.set({'gateway_ip': gateway_ip});
            this.model.save(undefined, {success: function(model, response) {
                UTILS.Messages.getCallbacks("Subnet "+subnet_name + " updated.", "Error updating subnet "+subnet_name, {context: this});   
            }, error: function(response) {
                console.log("error", response);
            }});    
            this.close();  
        } else if (disable_gateway === true) {
            this.model.save(undefined, {success: function(model, response) {
                UTILS.Messages.getCallbacks("Subnet "+subnet_name + " created.", "Error updating subnet "+subnet_name, {context: this});   
            }, error: function(response) {
                console.log("error", response);
            }});  
            this.close();
        }

    }

});