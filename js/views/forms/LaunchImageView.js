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
      'change .volumeOptionsSelect': 'changeVolumeOptions',
      'change .flavorOptionsSelect': 'changeFlavorOptions'
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
        var networks = this.options.networks;
        if (JSTACK.Keystone.getservice("network") === undefined) {
            networks = undefined;
        }
        $(this.el).append(this._template({model:this.model, volumes: this.options.volumes, flavors: flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.options.quotas, instancesModel: this.options.instancesModel, networks: networks, ports: this.options.ports, tenant: this.options.tenant, volumeSnapshots: this.options.volumeSnapshots}));
        $('#launch_image').modal();
        $('.network-sortable').sortable({
            connectWith: '.connected'
        });
        this.changeFlavorOptions();
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

    changeFlavorOptions: function(e) {
        var flavor_id = $( "#id_flavor option:selected")[0].value;
        for (var i in this.options.flavors.models) {
            if (this.options.flavors.models[i].id === flavor_id) {
                var flavor = this.options.flavors.models[i];
                $("#flavor_name").text(flavor.get('name')); 
                $("#flavor_vcpus").text(flavor.get('vcpus')); 
                $("#flavor_disk").text(flavor.get('disk')); 
                $("#flavor_ephemeral").text(flavor.get('OS-FLV-EXT-DATA:ephemeral')); 
                $("#flavor_disk_total").text(flavor.get("disk")+flavor.get('OS-FLV-EXT-DATA:ephemeral')); 
                $("#flavor_ram").text(flavor.get('ram'));           
            }
        }
        
    },

    detailsTab: function(e) {
        $('#input_details').show();
        $('#input_access_and_security').hide();
        $('#input_post-creation').hide();
        $('#input_volumes').hide();
        $('#input_networks').hide(); 
    },

    accesAndSecurityTab: function(e) {
        $('#input_access_and_security').show();
        $('#input_details').hide();
        $('#input_post-creation').hide();
        $('#input_volumes').hide();
        $('#input_networks').hide(); 
    },

    postCreationTab: function(e) {
        $('#input_post-creation').show();
        $('#input_details').hide();
        $('#input_access_and_security').hide();
        $('#input_volumes').hide();
        $('#input_networks').hide(); 
    },

    networksTab: function(e) {
        $('#input_networks').show();
        $('#input_details').hide();
        $('#input_access_and_security').hide();
        $('#input_post-creation').hide();
        $('#input_volumes').hide();  
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
        var block_device_mapping = {};

        if ($("#id_keypair option:selected")[0].value !== '') {
            key_name = $("#id_keypair option:selected")[0].value;
        }

        if ($("#volume option:selected")[0].value !== '') {
            var volume_id = $("#volume option:selected")[0].value;
            var device_name = $('input[name=device_name]').val();
            console.log("volume snapshots", this.options.volumeSnapshots);
            block_device_mapping.volume_id = volume_id;
            block_device_mapping.device_name = device_name;
        }

        flavorReg = $("#id_flavor option:selected")[0].value;

        $('input[name=security_groups]:checked').each(function () {
            security_groups.push($(this)[0].value);
        });

        $('#network-selected li div').each(function() {
            var network_id = this.getAttribute("value");
            var chosen_network = self.options.networks.get(network_id);
            var nets = {};
            nets.uuid = network_id;
            var f_ips = [];
            for (var i in self.options.ports.models) {
                if (network_id === self.options.ports.models[i].get("network_id")) {
                    var fixed_ips = self.options.ports.models[i].get("fixed_ips");
                    for (var j in fixed_ips) {
                        f_ips.push(fixed_ips[j].ip_address);
                        nets.fixed_ips = f_ips; 
                    }                                    
                }
            }                      
            netws.push(nets);
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
        instance.set({"block_device_mapping": block_device_mapping});

        if (flavorReg !== "") {
        instance.save(undefined, UTILS.Messages.getCallbacks("Instance "+instance.get("name") + " launched.", "Error launching instance "+instance.get("name"),
            {context:self, href:"#nova/instances/"}));
        }

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