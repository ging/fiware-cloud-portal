var LaunchImageView = Backbone.View.extend({

    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn-image': 'goPrev',
      'click #close-image': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'goNext',
      'change .volumeOptionsSelect': 'changeVolumeOptions',
      'change .flavorOptionsSelect': 'changeFlavorOptions', 
      'keyup #icount': 'changeICount'
    },

    initialize: function() {
        this.options.keypairs.fetch();
        this.options.flavors.fetch();
        this.options.secGroups.fetch();

        if (JSTACK.Keystone.getservice("network") === undefined) {
            this.networks = undefined;
            this.steps = [
            {id: 'input_details', name: 'Details'}, 
            {id: 'input_access_and_security', name: 'Access & Security'}, 
            {id: 'input_post-creation', name: 'Post-Creation'},
            {id: 'input_summary', name: 'Summary'}];
        
        } else {
            this.networks = [];

            for (var index in this.options.networks.models) {
                var network = this.options.networks.models[index];
                var tenant_id = network.get('tenant_id');
                if (tenant_id == this.options.tenant) {
                    this.networks.push(network);
                }
            }

            this.steps = [
                {id: 'input_details', name: 'Details'}, 
                {id: 'input_access_and_security', name: 'Access & Security'}, 
                {id: 'input_networks', name: 'Networking'},
                //{id: 'input_volumes', name: 'Volume Options'},
                {id: 'input_post-creation', name: 'Post-Creation'},
                {id: 'input_summary', name: 'Summary'}];
        }

        this.instanceData = {};
        this.currentStep = 0;

        this.quotas = {};
        this.quotas.cpus = 0;
        this.quotas.ram = 0;
        this.quotas.disk = 0;

        this.quotas.flavor_error = false;
        this.quotas.count_error = false;

        this.quotas.quota_set = this.options.quotas.get("quota_set");

        for (var instIdx in this.options.instancesModel.models) {
            var instance = this.options.instancesModel.models[instIdx];
            var flavor = this.options.flavors.get(instance.get("flavor").id);
            if (flavor) {
                this.quotas.cpus = this.quotas.cpus + flavor.get('vcpus');
                this.quotas.ram = this.quotas.ram + flavor.get('ram');
                this.quotas.disk = this.quotas.disk + flavor.get('disk');
            }
        }
    },

    render: function () {
        if ($('#launch_image').html() != null) {
            return;
        }
        
        $(this.el).append(this._template({model:this.model, volumes: this.options.volumes, flavors: this.options.flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.quotas, instancesModel: this.options.instancesModel, networks: this.networks, ports: this.options.ports, volumeSnapshots: this.options.volumeSnapshots, steps: this.steps}));
        $('#launch_image').modal();
        $('.network-sortable').sortable({
            connectWith: '.connected'
        });
        this.changeFlavorOptions();
        this.changeICount();
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

                var quotaset = this.quotas.quota_set;

                $('#cpubar').css('background-color', '#468847');
                $('#diskbar').css('background-color', '#468847');
                $('#rambar').css('background-color', '#468847');

                var cpu_width = 100 * (this.quotas.cpus + flavor.get('vcpus')) / quotaset.cores;
                var disk_width = 100 * (this.quotas.cpus + flavor.get("disk") + flavor.get('OS-FLV-EXT-DATA:ephemeral')) / quotaset.gigabytes;
                var mem_width = 100 * (this.quotas.ram + flavor.get('ram')) / quotaset.ram;

                this.quotas.flavor_error = false;

                if (cpu_width > 100) {
                    cpu_width = 100;
                    $('#icountbar').css('background-color', '#b94a48');
                    this.quotas.flavor_error = true;
                }   
                if (disk_width > 100) {
                    disk_width = 100;
                    $('#diskbar').css('background-color', '#b94a48');
                    this.quotas.flavor_error = true;
                }
                if (mem_width > 100) {
                    mem_width = 100;
                    $('#rambar').css('background-color', '#b94a48');
                    this.quotas.flavor_error = true;
                }

                $('#cpubar').width(cpu_width + '%');
                $('#diskbar').width(disk_width + '%');
                $('#rambar').width(mem_width + '%');

            }
        }
    },

    changeICount: function(e) {

        var count = parseInt($("input:[name=count]").val(), 10);
        if (isNaN(count)) {
            count = 0;
        }
        var quotaset = this.quotas.quota_set;
        var width = 100 * (this.options.instancesModel.length + count) / quotaset.instances;

        this.quotas.count_error = false;

        $('#icountbar').css('background-color', '#468847');

        if (width > 100) {
            width = 100;
            $('#icountbar').css('background-color', '#b94a48');
            this.quotas.count_error = true;
        }   

        $('#icountbar').width(width + '%');
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
            var next_line = next_id + '_line';
            
            $(curr_id).hide();
            $(next_id).show();
            $(next_tab).addClass('active');
            $(next_line).addClass('active');

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
                $('#nextBtn-image').attr("disabled", null);
            }

            var curr_id = '#' + this.steps[this.currentStep].id;
            var curr_tab = curr_id + '_tab';
            var curr_line = curr_id + '_line';
            var prev_id = '#' + this.steps[this.currentStep - 1].id;
            
            $(curr_id).hide();
            $(prev_id).show();
            $(curr_tab).removeClass('active');
            $(curr_line).removeClass('active');

            this.currentStep = this.currentStep - 1;
        }
    },

    makeSummary: function() {

        var self = this;

        var name = $('input[name=instance_name]').val();
        var image_id = this.model.id;
        var flavor, keypair, availability_zone;
        var groups = [];
        
        var netws = [];
        var ip_address = [];
        var network_id = "";
        var block_device_mapping = {};

        if ($("#id_keypair option:selected")[0].value !== '') {
            keypair = $("#id_keypair option:selected")[0].value;
        }

        if ($("#volume option:selected")[0].value !== '') {
            var volume_id = $("#volume option:selected")[0].value;
            var device_name = $('input[name=device_name]').val();
            var volume = $('input[name=volume_snapshot]').val();
            var delete_on_terminate = $('input[name=delete_on_terminate]').is(':checked') ? "on" : "off";
            var seleceted_volume = this.options.volumes.get(volume_id);
            var volume_size = seleceted_volume.get('size');
            console.log("volume snapshots", this.options.volumeSnapshots);
            block_device_mapping.volume_id = volume_id;
            block_device_mapping.device_name = device_name;
            //block_device_mapping.volume_size = volume_size;
            console.log(delete_on_terminate);
            block_device_mapping.delete_on_terminate = delete_on_terminate;
        }

        flavor = $("#id_flavor option:selected")[0].value;

        $('input[name=security_groups]:checked').each(function () {
            groups.push($(this)[0].value);
        });
        $('#network-selected li div').each(function() {
            var network_id = this.getAttribute("value");
            var chosen_network = self.options.networks.get(network_id);
            var nets = {};
            //nets.uuid = network_id;
            //2nd alternative
            //nets["net-id"] = network_id;
            var f_ips = [];
            for (var i in self.options.ports.models) {
                if (network_id === self.options.ports.models[i].get("network_id")) {
                    var fixed_ips = self.options.ports.models[i].get("fixed_ips");
                    for (var j in fixed_ips) {
                        f_ips.push(fixed_ips[j].ip_address);
                        //nets.fixed_ips = f_ips; 

                        //1nd alternative:
                        //----------------
                        //nics = [{'net-id': '11111111-1111-1111-1111-111111111111',
                        //'v4-fixed-ip': '10.0.0.7'}]
                        //nets["v4-fixed-ip"] = f_ips; 
                        //nets["net-id"] = network_id; 

                        //2nd alternative
                        //---------------
                        //networks": [{"uuid": "00000000-0000-0000-0000-000000000000"}, {"uuid": "11111111-1111-1111-1111-111111111111"}]}}'
                        //nets.uuid = network_id; 

                        //3rd alternative
                        //---------------
                        nets = network_id; 
                    }                                    
                }
            }                      
            netws.push(nets);
            //netws.push(network_id);
        }); 

        var user_data = $('textarea[name=user_data]').val();
        //var min_count = $('input[name=count]').val();
        //var max_count = $('input[name=count]').val();
        var instance_count = $('input[name=instance_count]').val();
        var source_type = "image_id";

        this.instanceData.name = name;
        this.instanceData.source_type = source_type;
        this.instanceData.image_id = image_id;
        this.instanceData.flavor = flavor;
        this.instanceData.keypair = keypair;
        this.instanceData.customization_script = user_data;
        this.instanceData.groups = groups;
        this.instanceData.count = instance_count;
        //this.instanceData.max_count = max_count;
        this.instanceData.availability_zone = availability_zone;
        this.instanceData.network = netws;
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

        $('#summary_errors').hide();
        $('#quota error').hide();
        $('#network_error').hide();
        $('#nextBtn-image').attr("disabled", null);

        if (this.quotas.count_error || this.quotas.flavor_error) {
            $('#summary_errors').show();
            $('#quota_error').show();
            $('#nextBtn-image').attr("disabled", "disabled");
            $('#nextBtn-image').css("background-color", "#0489B7");
        }

        if (this.networks && this.networks.length !== 0 && netws.length === 0) {
            $('#summary_errors').show();
            $('#network_error').show();
            $('#nextBtn-image').attr("disabled", "disabled");
            $('#nextBtn-image').css("background-color", "#0489B7");
        }
    },

    launch: function(e) {
        var self = this;

        var instance = new Instance();
        instance.set({"source_type": this.instanceData.source_type});
        instance.set({"name": this.instanceData.name});
        instance.set({"image_id": this.instanceData.image_id});
        instance.set({"flavor": this.instanceData.flavor});
        instance.set({"keypair": this.instanceData.keypair});
        instance.set({"customization_script": this.instanceData.customization_script});
        instance.set({"groups": this.instanceData.groups});
        instance.set({"count": this.instanceData.count});
        //instance.set({"max_count": this.instanceData.max_count});
        instance.set({"availability_zone": this.instanceData.availability_zone});
        instance.set({"network": this.instanceData.network});
        //instance.set({"nics": this.instanceData.network});
        instance.set({"block_device_mapping": this.instanceData.block_device_mapping});

        console.log("instance", instance);

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