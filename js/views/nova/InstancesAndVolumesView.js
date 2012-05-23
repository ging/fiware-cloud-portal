var InstancesAndVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaInstancesAndVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox':'enableDisableTerminateButton',
        'click .btn-password':'onChangePassword',
        'click .btn-reboot':'onReboot',
        'click .btn-terminate':'onTerminate',
        'click .btn-terminate-group':'onTerminateGroup'
    },
    
    onChangePassword: function(evt) {
        var instance = evt.target.value;
        var subview = new ChangePasswordView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },
    
    onReboot: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        var subview = new ConfirmView({el: 'body', title: "Reboot Instance", btn_message: "Reboot Instance", onAccept: function() {
            inst.reboot(false);
        }});
        subview.render();
    },
    
    onTerminate: function(evt) {
    	console.log("Event target = "+evt.target.value);
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        var subview = new ConfirmView({el: 'body', title: "Terminate Instance", btn_message: "Terminate Instance", onAccept: function() {
            inst.destroy();
        }});
        subview.render();
    },
    
    onTerminateGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Terminate Instances", btn_message: "Terminate Instances", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var instance = $(this).val(); 
                    console.log("Instance to delete: " + instance);
                    var inst = self.model.get(instance);
                    inst.destroy();
            });
        }});
        subview.render();
    },
    
    enableDisableTerminateButton: function () {
        if ($(".checkbox:checked").size() > 0) { 
            $("#instances_terminate").attr("disabled", false);
        } else {
            $("#instances_terminate").attr("disabled", true);
        }
        
    },
    
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models, flavors:this.options.flavors});
    },
        
    render: function () {
        if ($("#instances").html() != null) {
            var new_template = this._template({models:this.model.models, flavors:this.options.flavors});
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var instanceId = this.model.models[index].id;
                if ($("#checkbox_"+instanceId).is(':checked')) {
                    checkboxes.push(instanceId);
                }
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var instanceId = checkboxes[index];
                var check = $("#checkbox_"+instanceId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var instanceId = dropdowns[index];
                var drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            
        }
        this.enableDisableTerminateButton();
        return this;
    }
    
});