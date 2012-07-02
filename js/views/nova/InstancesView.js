var NovaInstancesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaInstancesTemplate').html()),
    
    dropdownId: undefined,
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox_instances':'enableDisableTerminateButton',
        'click .btn-edit-instances':'onEditInstance',
        'click .btn-snapshot':'onSnapshot',
        'click .btn-pause':'onPause',
        'click .btn-unpause':'onUnpause',
        'click .btn-suspend':'onSuspend',
        'click .btn-resume':'onResume',
        'click .btn-password':'onChangePassword',
        'click .btn-reboot':'onReboot',
        'click .btn-terminate':'onTerminate',
        'click .btn-terminate-group':'onTerminateGroup'
    },
    
    onClose: function() {
        console.log("Closing");
        this.undelegateEvents();
        this.unbind();
    },
    
    onEditInstance: function(evt) {
        console.log("Editing");
        var instance = evt.target.value;
        var subview = new UpdateInstanceView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },
        
    onSnapshot: function(evt) {
        var instance = evt.target.value;
        var subview = new CreateSnapshotView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },
    
    onPause: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.pauseserver(); 
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" paused."});     
        subview.render();
    },
    
    onUnpause: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.unpauseserver();
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" unpaused."});     
        subview.render(); 
    },    
    
    onSuspend: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.suspendserver(); 
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" suspended."});     
        subview.render();
    },
    
    onResume: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.resumeserver(); 
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" resumed."});     
        subview.render();
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
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" rebooted."});     
            subview.render();
        }});
        subview.render();
    },
    
    onTerminate: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        var subview = new ConfirmView({el: 'body', title: "Terminate Instance", btn_message: "Terminate Instance", onAccept: function() {
            inst.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" terminated."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onTerminateGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Terminate Instances", btn_message: "Terminate Instances", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var instance = $(this).val(); 
                    var inst = self.model.get(instance);
                    inst.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instances "+inst.get("name")+" terminated."});     
                    subview.render();
            });
        }});
        subview.render();
    },
    
    enableDisableTerminateButton: function () {
        if ($(".checkbox_instances:checked").size() > 0) { 
            $("#instances_terminate").attr("disabled", false);
        } else {
            $("#instances_terminate").attr("disabled", true);
        }
        
    },
    
    renderFirst: function() {
        $(this.el).html(this._template({models:this.model.models, flavors:this.options.flavors}));
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },
        
    render: function () {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
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