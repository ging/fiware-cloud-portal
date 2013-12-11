var LaunchImageView = Backbone.View.extend({

    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn-image': 'close',
      'click #close-image': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'launch',
      'click #details' : 'detailsTab',
      'click #access_and_security' : 'accesAndSecurityTab',
      'click #networks': 'networksTab',
      'click #volumes': 'volumesTab',
      'click #post-creation': 'postCreationTab',
      'change .volumeOptionsSelect': 'changeVolumeOptions'
    },

    initialize: function() {
        this.options.keypairs.fetch();
        this.options.flavors.fetch();
        this.options.secGroups.fetch();
    },

    render: function () {
        var flavors = this.options.flavors;
        if ($('#launch_image').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, volumes: this.options.volumes, flavors: flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.options.quotas, instancesModel: this.options.instancesModel, networks: this.options.networks, ports: this.options.ports, tenant: this.options.tenant}));
        $('#launch_image').modal();
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
        $('#launch_image').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    changeVolumeOptions: function(e) {
        if ($('.volumeOptionsSelect :selected').val() == 'not_volume') {
            if ($('.volume').show()) {
                $('.volume').hide();
            }
            if ($('.device_name').show()){
                $('.device_name').hide();
            }
            if ($('.delete_on_terminate').show()){
                $('.delete_on_terminate').hide();
            }            
        } else if ($('.volumeOptionsSelect :selected').val() == 'volume') {
            if ($('.volume').hide()) {
                $('.volume').show();
                $("label[for='volume']").text("Volume");
                $("select[name=volume_snapshot] option:first").text("Select Volume");
            }
            if ($('.device_name').hide()){
                $('.device_name').show();
            }
            if ($('.delete_on_terminate').hide()){
                $('.delete_on_terminate').show();
            }  
        } else if ($('.volumeOptionsSelect :selected').val() == 'snapshot') {
            if ($('.volume').hide()) {
                $('.volume').show();
                $("label[for='volume']").text("Volume Snapshot");
                $("select[name=volume_snapshot] option:first").text("Select Volume Snapshot");
            }
            if ($('.device_name').hide()){
                $('.device_name').show();
            }
            if ($('.delete_on_terminate').hide()){
                $('.delete_on_terminate').show();
            }  
        }

    },

    detailsTab: function(e) {
        if ($('#input_details').hide()) {
            $('#input_details').show();
        } 
        if ($('#input_access_and_security').show()) {
            $('#input_access_and_security').hide();
        }   
        if ($('#input_post-creation').show()) {
            $('#input_post-creation').hide();
        } 
        if ($('#input_networks').show()) {
            $('#input_networks').hide();
        }  
        if ($('#input_volumes').show()) {
            $('#input_volumes').hide();
        }  
    },

    accesAndSecurityTab: function(e) {
        if ($('#input_access_and_security').hide()) {
            $('#input_access_and_security').show();
        } 
        if ($('#input_details').show()) {
            $('#input_details').hide();
        } 
        if ($('#input_post-creation').show()) {
            $('#input_post-creation').hide();
        } 
        if ($('#input_networks').show()) {
            $('#input_networks').hide();
        } 
        if ($('#input_volumes').show()) {
            $('#input_volumes').hide();
        }   
    },

    postCreationTab: function(e) {
        if ($('#input_post-creation').hide()) {
            $('#input_post-creation').show();
        } 
        if ($('#input_details').show()) {
            $('#input_details').hide();
        } 
        if ($('#input_access_and_security').show()) {
            $('#input_access_and_security').hide();
        }  
        if ($('#input_networks').show()) {
            $('#input_networks').hide();
        }
        if ($('#input_volumes').show()) {
            $('#input_volumes').hide();
        }  
    },

    networksTab: function(e) {
        if ($('#input_networks').hide()) {
            $('#input_networks').show();
        }
        if ($('#input_post-creation').show()) {
            $('#input_post-creation').hide();
        } 
        if ($('#input_details').show()) {
            $('#input_details').hide();
        } 
        if ($('#input_access_and_security').show()) {
            $('#input_access_and_security').hide();
        }  
        if ($('#input_volumes').show()) {
            $('#input_volumes').hide();
        }  
    },

    volumesTab: function(e) {
        if ($('#input_volumes').hide()) {
            $('#input_volumes').show();
        }
        if ($('#input_post-creation').show()) {
            $('#input_post-creation').hide();
        } 
        if ($('#input_details').show()) {
            $('#input_details').hide();
        } 
        if ($('#input_access_and_security').show()) {
            $('#input_access_and_security').hide();
        }  
        if ($('#input_networks').show()) {
            $('#input_networks').hide();
        }
    },

    launch: function(e) {
        var self = this;

        var instance = new Instance();
        var name = $('input[name=instance_name]').val();
        var imageReg = this.model.id;
        var flavorReg, key_name, availability_zone;
        var security_groups = [];
        
        var netws = [];
        var ip_address = [];
        var network_id = "";
        var f_ips = [];

        if ($("#id_keypair option:selected")[0].value !== '') {
            key_name = $("#id_keypair option:selected")[0].value;
        }

        flavorReg = $("#id_flavor option:selected")[0].value;

        $('input[name=security_groups]:checked').each(function () {
            security_groups.push($(this)[0].value);
        });

        $('input[name=networks]:checked').each(function () {
            for (var index in self.options.networks.models) {
                if (self.options.networks.models[index].get("name") == $(this)[0].value) {
                    var chosen_network = self.options.networks.models[index];
                    network_id = self.options.networks.models[index].get("id");
                    var nets = {};       
                    nets.uuid = network_id;    
                    for (var i in self.options.ports.models) {
                        if (network_id == self.options.ports.models[i].get("network_id")) {
                            var fixed_ips = self.options.ports.models[i].get("fixed_ips");
                            for (var j in fixed_ips) {
                                f_ips.push(fixed_ips[j].ip_address);
                                nets.fixed_ips = f_ips; 
                            }                                    
                        }
                    }                      
                netws.push(nets);
                console.log('netws', netws);  
                }
            }
        });

        var user_data = $('textarea[name=user_data]').val();
        var min_count = $('input[name=count]').val();
        var max_count = $('input[name=count]').val();

        instance.set({"name": name});
        instance.set({"imageReg": imageReg});
        instance.set({"flavorReg": flavorReg});
        instance.set({"key_name": key_name});
        instance.set({"user_data": user_data});
        instance.set({"security_groups": security_groups});
        instance.set({"min_count": min_count});
        instance.set({"max_count": max_count});
        instance.set({"availability_zone": availability_zone});
        instance.set({"networks": netws});

        instance.save(undefined, UTILS.Messages.getCallbacks("Instance "+instance.get("name") + " launched.", "Error launching instance "+instance.get("name"),
            {context:self, href:"#nova/instances/"}));


        /*instance.save(undefined, {success: function () {
            self.close();
            window.location.href = "#nova/instances/";
            var subview = new MessagesView({state: "Success", title: "Instance "+instance.get("name")+" launched."});
            subview.render();

        }, error: function (model, error) {
            self.close();
            console.log("Error: ", error);
            window.location.href = "#nova/instances/";
            var subview = new MessagesView({state: "Error", title: " Error launching instance "+instance.get("name") + ". Cause: " + error.message, info: error.body});
            subview.render();
        }});*/

        //this.options.addInstance(instance);
    }
});