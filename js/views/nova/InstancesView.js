var NovaInstancesView = Backbone.View.extend({

    _template: _.itemplate($('#novaInstancesTemplate').html()),

    dropdownId: undefined,

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events:{
        'click .btn-edit-instance-actions' : 'onEditInstance',
        'click .btn-vnc-actions':'onVNC',
        'click .btn-log-actions':'onLog',
        'click .btn-snapshot-actions':'onSnapshotInstance',
        'click .btn-pause-actions':'onPauseInstance',
        'click .btn-unpause-actions':'onUnpauseInstance',
        'click .btn-suspend-actions':'onSuspendInstance',
        'click .btn-resume-actions':'onResumeInstance',
        'click .btn-password-actions':'onChangePasswordInstance',
        'click .btn-reboot-actions':'onRebootInstance',
        'click .btn-terminate-actions':'onTerminateGroup',

        'change .checkbox_instances':'enableDisableTerminateButton',
        'change .checkbox_all':'checkAll',
        'click .btn-edit-instances':'onEditInstances',
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

    onEditInstance: function(evt) {
        var instance = $(".checkbox:checked").val();
        var subview = new UpdateInstanceView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },

    onVNC: function(evt) {
        var instance = $(".checkbox:checked").val();
        window.location.href = '#nova/instances/'+instance+'/detail?view=vnc';
    },

    onLog: function(evt) {
        var instance = $(".checkbox:checked").val();
        window.location.href = 'nova/instances/'+instance+'/detail?view=log';
    },

    onSnapshotInstance: function(evt) {
        var instance = $(".checkbox:checked").val();
        var subview = new CreateSnapshotView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },

    onPauseInstance: function(evt) {
        var self = this;
        $(".checkbox_instances:checked").each(function () {
            var instance = $(this).val();
            var inst = self.model.get(instance);
            inst.pauseserver();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" paused."});
            subview.render();
        });
    },

    onUnpauseInstance: function(evt) {
        var self = this;
        $(".checkbox_instances:checked").each(function () {
            var instance = $(this).val();
            var inst = self.model.get(instance);
            inst.unpauseserver();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" unpaused."});
            subview.render();
        });
    },

    onSuspendInstance: function(evt) {
        var self = this;
        $(".checkbox_instances:checked").each(function () {
            var instance = $(this).val();
            var inst = self.model.get(instance);
            inst.suspendserver();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" suspended."});
            subview.render();
        });
    },

    onResumeInstance: function(evt) {
        var self = this;
        $(".checkbox_instances:checked").each(function () {
            var instance = $(this).val();
            var inst = self.model.get(instance);
            inst.resumeserver();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" resumed."});
            subview.render();
        });
    },

    onChangePasswordInstance: function(evt) {
        var instance = $(".checkbox:checked").val();
        var subview = new ChangePasswordView({el: 'body', model: this.model.get(instance)});
        subview.render();
    },

    onRebootInstance: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Reboot Instances", btn_message: "Reboot Instances", onAccept: function() {
            $(".checkbox_instances:checked").each(function () {
                    var instance = $(this).val();
                    var inst = self.model.get(instance);
                    inst.reboot(true);
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" rebooted."});
                    subview.render();
            });
        }});
        subview.render();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("reset", this.render, this);
    },

    onEditInstances: function(evt) {
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
        var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" paused."});
        subview.render();
    },

    onUnpause: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.unpauseserver();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" unpaused."});
        subview.render();
    },

    onSuspend: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.suspendserver();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" suspended."});
        subview.render();
    },

    onResume: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        inst.resumeserver();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" resumed."});
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
            inst.reboot(true);
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" rebooted."});
            subview.render();
        }});
        subview.render();
    },

    onTerminate: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        var subview = new ConfirmView({el: 'body', title: "Terminate Instance", btn_message: "Terminate Instance", onAccept: function() {
            inst.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+inst.get("name")+" terminated."});
            subview.render();
        }});

        subview.render();
    },

    onTerminateGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Terminate Instances", btn_message: "Terminate Instances", onAccept: function() {
            $(".checkbox_instances:checked").each(function () {
                    var instance = $(this).val();
                    var inst = self.model.get(instance);
                    inst.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Instances "+inst.get("name")+" terminated."});
                    subview.render();
            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_instances").attr('checked','checked');
            $(".btn-edit-instance-actions").attr("disabled", true);
            $(".btn-vnc-actions").attr("disabled", true);
            $(".btn-log-actions").attr("disabled", true);
            $(".btn-snapshot-actions").attr("disabled", true);
            $(".btn-password-actions").attr("disabled", true);
            this.enableDisableTerminateButton();
        } else {
            $(".checkbox_instances").attr('checked',false);
            $(".btn-edit-instance-actions").attr("disabled", false);
            $(".btn-vnc-actions").attr("disabled", false);
            $(".btn-log-actions").attr("disabled", false);
            $(".btn-snapshot-actions").attr("disabled", false);
            $(".btn-password-actions").attr("disabled", false);
            this.enableDisableTerminateButton();
        }

    },

    enableDisableTerminateButton: function () {
        var inst = $(".checkbox_instances:checked").val();
        var instance = this.model.get(inst);
        if ($(".checkbox_instances:checked").size() > 0) {
            $("#instances_terminate").attr("disabled", false);
            $(".btn-edit-instance-actions").attr("disabled", false);
            $(".btn-vnc-actions").attr("disabled", false);
            $(".btn-log-actions").attr("disabled", false);
            $(".btn-snapshot-actions").attr("disabled", false);
            $(".btn-pause-actions").attr("disabled", false);
            $(".btn-unpause-actions").attr("disabled", false);
            $(".btn-suspend-actions").attr("disabled", false);
            $(".btn-resume-actions").attr("disabled", false);
            $(".btn-password-actions").attr("disabled", false);
            $(".btn-reboot-actions").attr("disabled", false);
            $(".btn-terminate-actions").attr("disabled", false);
            if (instance.get("status") != "PAUSED" && instance.get("status") != "SUSPENDED") {
                $(".btn-unpause-actions").attr("disabled", true);
                $(".btn-resume-actions").attr("disabled", true);
            } else if (instance.get("status") == "PAUSED") {
                $(".btn-unpause-actions").attr("disabled", false);
                $(".btn-pause-actions").attr("disabled", true);
            } else {
                $(".btn-resume-actions").attr("disabled", false);
                $(".btn-suspend-actions").attr("disabled", true);
            }
            if ($(".checkbox_instances:checked").size() > 1) {
                $(".btn-edit-instance-actions").attr("disabled", true);
                $(".btn-vnc-actions").attr("disabled", true);
                $(".btn-log-actions").attr("disabled", true);
                $(".btn-snapshot-actions").attr("disabled", true);
                $(".btn-password-actions").attr("disabled", true);
            } else {
                $(".btn-edit-instance-actions").attr("disabled", false);
                $(".btn-vnc-actions").attr("disabled", false);
                $(".btn-log-actions").attr("disabled", false);
                $(".btn-snapshot-actions").attr("disabled", false);
                $(".btn-password-actions").attr("disabled", false);
            }
        } else {
            $("#instances_terminate").attr("disabled", true);
            $(".btn-edit-instance-actions").attr("disabled", true);
            $(".btn-vnc-actions").attr("disabled", true);
            $(".btn-log-actions").attr("disabled", true);
            $(".btn-snapshot-actions").attr("disabled", true);
            $(".btn-pause-actions").attr("disabled", true);
            $(".btn-unpause-actions").attr("disabled", true);
            $(".btn-suspend-actions").attr("disabled", true);
            $(".btn-resume-actions").attr("disabled", true);
            $(".btn-password-actions").attr("disabled", true);
            $(".btn-reboot-actions").attr("disabled", true);
            $(".btn-terminate-actions").attr("disabled", true);
            $(".btn-edit-instance-actions").attr("disabled", true);
            $(".btn-vnc-actions").attr("disabled", true);
            $(".btn-log-actions").attr("disabled", true);
            $(".btn-snapshot-actions").attr("disabled", true);
            $(".btn-password-actions").attr("disabled", true);
        }

    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models, flavors:this.options.flavors});
        //$(this.el).html(this._template({models:this.model.models, flavors:this.options.flavors}));
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
            var index, instanceId, check, drop, drop_actions_selected;
            for (index in this.model.models) {
                instanceId = this.model.models[index].id;
                if ($("#checkbox_"+instanceId).is(':checked')) {
                    checkboxes.push(instanceId);
                }
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                }
            }
            var scrollTo = $(".scrollable").scrollTop();
            $(this.el).html(new_template);
            $(".scrollable").scrollTop(scrollTo);
            for (index in checkboxes) {
                instanceId = checkboxes[index];
                check = $("#checkbox_"+instanceId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }

            for (index in dropdowns) {
                instanceId = dropdowns[index];
                drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            if (($("#dropdown_actions").html() !== null) && (drop_actions_selected)) {
                $("#dropdown_actions").addClass("open");
            }

        }
        this.enableDisableTerminateButton();
        return this;
    }

});