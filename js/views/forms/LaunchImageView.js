var LaunchImageView = Backbone.View.extend({

    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn-image': 'goPrev',
      'click #close-image': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'goNext',
      'change .volumeOptionsSelect': 'changeVolumeOptions',
      'change .flavorOptionsSelect': 'changeFlavorOptions'
    },

    initialize: function() {
        this.options.keypairs.fetch();
        this.options.flavors.fetch();
        this.options.secGroups.fetch();

        this.networks = this.options.networks;
        this.steps = [
            {id: 'input_details', name: 'Details'}, 
            {id: 'input_access_and_security', name: 'Access & Security'}, 
            {id: 'input_networks', name: 'Networking'},
            {id: 'input_post-creation', name: 'Post-Creation'},
            {id: 'input_summary', name: 'Summary'}];

        if (JSTACK.Keystone.getservice("network") === undefined) {
            this.networks = undefined;
            this.steps = [
            {id: 'input_details', name: 'Details'}, 
            {id: 'input_access_and_security', name: 'Access & Security'}, 
            {id: 'input_post-creation', name: 'Post-Creation'},
            {id: 'input_summary', name: 'Summary'}];
        }

        this.instanceData = {};
        this.currentStep = 0;
    },

    render: function () {
        if ($('#launch_image').html() != null) {
            return;
        }
        
        $(this.el).append(this._template({model:this.model, volumes: this.options.volumes, flavors: this.options.flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.options.quotas, instancesModel: this.options.instancesModel, networks: this.networks, ports: this.options.ports, tenant: this.options.tenant, volumeSnapshots: this.options.volumeSnapshots, steps: this.steps}));
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

    goNext: function() {

        if (this.currentStep === this.steps.length - 1) {
            this.launch();
        } else {
            if (this.currentStep === 0) {
                $('#cancelBtn-image').html('Back');
            }
            if (this.currentStep === this.steps.length - 2) {
                $('#nextBtn-image').val('Launch instance');
                this.makeSummary();
            }

            var curr_id = '#' + this.steps[this.currentStep].id;
            var next_id = '#' + this.steps[this.currentStep + 1].id;
            var next_tab = next_id + '_tab';
            
            $(curr_id).hide();
            $(next_id).show();
            $(next_tab).addClass('active');

            this.currentStep = this.currentStep + 1;
        }
    }, 

    goPrev: function() {

        if (this.currentStep === 0) {
            this.close();
        } else {
            if (this.currentStep === 1) {
                $('#cancelBtn-image').html('Cancel');
            }
            if (this.currentStep === this.steps.length - 1) {
                $('#nextBtn-image').val('Next');
            }

            var curr_id = '#' + this.steps[this.currentStep].id;
            var curr_tab = curr_id + '_tab';
            var prev_id = '#' + this.steps[this.currentStep - 1].id;
            
            $(curr_id).hide();
            $(prev_id).show();
            $(curr_tab).removeClass('active');

            this.currentStep = this.currentStep - 1;
        }
    },

    makeSummary: function() {

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

        this.instanceData.name = name;
        this.instanceData.imageReg = imageReg;
        this.instanceData.flavorReg = flavorReg;
        this.instanceData.key_name = key_name;
        this.instanceData.user_data = user_data;
        this.instanceData.security_groups = security_groups;
        this.instanceData.min_count = min_count;
        this.instanceData.max_count = max_count;
        this.instanceData.availability_zone = availability_zone;
        this.instanceData.networks = netws;
        this.instanceData.block_device_mapping = block_device_mapping;

        $('#sum_instanceName').html(this.instanceData.name);
        $('#sum_image').html(this.model.get('name'));
        $('#sum_flavour').html($("#id_flavor option:selected")[0].text);
        $('#sum_instanceCount').html(this.instanceData.min_count);

        if (this.instanceData.key_name !== undefined) {
            $('#sum_keypair').html(this.instanceData.key_name);
            $('#sum_keypair').removeClass('warning');
        } else {
            $('#sum_keypair').html('No keypair selected. You will need a keypair to access the instance.');
            $('#sum_keypair').addClass('warning');
        }
    },

    launch: function(e) {
        var self = this;

        var instance = new Instance();
        
        instance.set({"name": this.instanceData.name});
        instance.set({"imageReg": this.instanceData.imageReg});
        instance.set({"flavorReg": this.instanceData.flavorReg});
        instance.set({"key_name": this.instanceData.key_name});
        instance.set({"user_data": this.instanceData.user_data});
        instance.set({"security_groups": this.instanceData.security_groups});
        instance.set({"min_count": this.instanceData.min_count});
        instance.set({"max_count": this.instanceData.max_count});
        instance.set({"availability_zone": this.instanceData.availability_zone});
        instance.set({"networks": this.instanceData.netws});
        instance.set({"block_device_mapping": this.instanceData.block_device_mapping});

        if (this.instanceData.flavorReg !== "") {
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