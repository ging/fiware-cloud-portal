var VDCServiceView = Backbone.View.extend({

    _template: _.itemplate($('#novaVDCServiceTemplate').html()),

    dropdownId: undefined,

    initialize: function() {
        var that = this;
        this.model.unbind("change");
        this.model.bind("change", this.render, this);
        this.model.fetch();
        this.timer = setInterval(function() {
            that.model.fetch();
        }, 4000);
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
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("change", this.render, this);
    },

    onEditInstance: function(evt) {
        var instance = evt.target.value;
        var subview = new UpdateInstanceView({el: 'body', model: this.model.getInstance(instance)});
        subview.render();
    },

    onSnapshot: function(evt) {
        var instance = evt.target.value;
        var subview = new CreateSnapshotView({el: 'body', model: this.model.getInstance(instance)});
        subview.render();
    },

    onPause: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        inst.pauseserver();
        var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" paused."});
        subview.render();
    },

    onUnpause: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        inst.unpauseserver();
        var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" unpaused."});
        subview.render();
    },

    onSuspend: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        inst.suspendserver();
        var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" suspended."});
        subview.render();
    },

    onResume: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        inst.resumeserver();
        var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" resumed."});
        subview.render();
    },

    onChangePassword: function(evt) {
        var instance = evt.target.value;
        var subview = new ChangePasswordView({el: 'body', model: this.model.getInstance(instance)});
        subview.render();
    },

    onReboot: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        var subview = new ConfirmView({el: 'body', title: "Reboot Instance", btn_message: "Reboot Instance", onAccept: function() {
            inst.reboot(false);
            var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" rebooted."});
            subview.render();
        }});
        subview.render();
    },

    onTerminate: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.getInstance(instance);
        var subview = new ConfirmView({el: 'body', title: "Terminate Instance", btn_message: "Terminate Instance", onAccept: function() {
            inst.destroy();
            var subview = new MessagesView({state: "Success", title: "Instance "+inst.get("name")+" terminated."});
            subview.render();
        }});
        subview.render();
    },

    onTerminateGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Terminate Instances", btn_message: "Terminate Instances", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var instance = $(this).val();
                    var inst = self.model.getInstance(instance);
                    inst.destroy();
                    var subview = new MessagesView({state: "Success", title: "Instances "+inst.get("name")+" terminated."});
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
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.get("models"), vdc: this.options.vdc, service: this.model.get("name"), flavors:this.options.flavors});
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },

    renderSecond: function () {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
            var new_template = this._template({models:this.model.get("models"), vdc: this.options.vdc, service: this.model.get("name"), flavors:this.options.flavors});
            var checkboxes = [];
            var dropdowns = [];
            var index, instanceId, check, drop;
            for (index in this.model.get("models")) {
                instanceId = this.model.get("models")[index].id;
                if ($("#checkbox_"+instanceId).is(':checked')) {
                    checkboxes.push(instanceId);
                }
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
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

        }
        this.enableDisableTerminateButton();
        return this;
    },

    render: function() {
        if ($("#vdcservice").html() === null) {
            this.renderFirst();
        } else {
            this.renderSecond();
        }
    }

});