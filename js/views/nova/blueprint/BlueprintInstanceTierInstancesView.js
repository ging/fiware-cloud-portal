var BlueprintInstanceTierInstancesView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstanceTierInstancesTemplate').html()),

    tableView: undefined,

    qtip: undefined,

    initialize: function() {
        var self = this;
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.options.projects = UTILS.GlobalModels.get("projects");
        this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.qtip = {
            content: '<input id="instances-to-add" type="test" value="1" class="tier-instances-num"><div class="btns"><a class="btn-plus">+</a><a class="btn-minus">-</a></div> instances <a id="add-instances" class="btn btn-blue btn-small">Add</a>',
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            show: 'click',
            hide: 'unfocus',
            style: {
                tip: true,
                classes: 'ui-tooltip-add-instances'
            },
            events: {
                show: function(event, api) {
                    $('.btn-minus').bind('click', {self: self}, self.reduceNumInstances);
                    $('.btn-plus').bind('click', {self: self}, self.increaseNumInstances);
                    $('#add-instances').bind('click', {self: self}, self.addNumInstances);
                    $("#instances-to-add").val(1);
                },
                hide: function() {
                    $('.btn-minus').unbind();
                    $('.btn-plus').unbind();
                    $('#add-instances').unbind();
                }
            }
        };
        this.renderFirst();
    },

    addNumInstances: function(evt) {
        var self = evt.data.self;
        console.log("Self:",self);
        var num = parseInt($("#instances-to-add").val(), 0);
        subview = new ConfirmView({
            el: 'body',
            title: "Add " + num + " Instances",
            btn_message: "Add Instances",
            onAccept: function() {
                var bp = self.options.blueprint;
                var tier = self.options.tier;
                var options = UTILS.Messages.getCallbacks("VMs were succesfully added to tier", "Error adding VM to tier.");
                var finalCB = options.callback;
                var resp = 0;
                var cb = function() {
                    resp++;
                    if (resp === num) {
                        finalCB();
                    }
                };
                options.callback = cb;
                for (var i = 0; i<num; i++) {
                    delete tier.tierInstancePDto;
                    delete tier.tierInstancePDto_asArray;
                    options.tier = tier;
                    bp.addVMToTier(options);
                }
            }
        });
        subview.render();
    },

    reduceNumInstances: function() {
        var num = parseInt($("#instances-to-add").val(), 0);
        if (num>1) {
            $("#instances-to-add").val(num-1);
        }
    },

    increaseNumInstances: function() {
        var num = parseInt($("#instances-to-add").val(), 0);
        $("#instances-to-add").val(num+1);
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Back to Tiers",
            url: "#nova/blueprints/instances/" + this.options.blueprint.get('blueprintName')
        },{
            label: "Add Instances",
            action: "add",
            cssclass: "btn-add-instances"
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        var activeSelected = function(size, id) {
            if (size === 1) {
                var entry = self.model.get(id);
                if (entry.get("status") !== "PAUSED" && entry.get("status") !== "SUSPENDED") {
                    return true;
                }
            }
        };
        var activeGroupSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") === "PAUSED" || entry.get("status") === "SUSPENDED") {
                        return false;
                    }
                }
                return true;
            }
        };
        var pausedSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") !== "PAUSED") {
                        return false;
                    }
                }
                return true;
            }
        };
        var suspendedSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") !== "SUSPENDED") {
                        return false;
                    }
                }
                return true;
            }
        };
        return [{
            label: "Edit Instance",
            action: "edit",
            activatePattern: oneSelected
        }, {
            label: "VNC Console",
            action: "vnc",
            activatePattern: oneSelected
        }, {
            label: "View Log",
            action: "log",
            activatePattern: oneSelected
        }, {
            label: "Create Snapshot",
            action: "snapshot",
            activatePattern: oneSelected
        }, {
            label: "Pause Instance",
            action: "pause",
            activatePattern: activeGroupSelected
        }, {
            label: "Unpause Instance",
            action: "unpause",
            activatePattern: pausedSelected
        }, {
            label: "Suspend Instance",
            action: "suspend",
            activatePattern: activeGroupSelected
        }, {
            label: "Resume Instance",
            action: "resume",
            activatePattern: suspendedSelected
        }, {
            label: "Change Password",
            action: "password",
            warn: true,
            activatePattern: activeSelected
        }, {
            label: "Reboot Instance",
            action: "reboot",
            warn: true,
            activatePattern: groupSelected
        }, {
            label: "Terminate Instance",
            action: "terminate",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Instance Name",
            tooltip: "Server's name",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "IP Address",
            tooltip: "IP Address",
            size: "15%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Server's RAM, number of virtual CPUs, and user disk",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "PaaS Status",
            tooltip: "Current server status",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Task",
            tooltip: "Current tasks performed on the server",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Power State",
            tooltip: "Server's power state",
            size: "15%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var flavorlist = {};
        for (var index in this.options.flavors.models) {
            var flavor = this.options.flavors.models[index];
            flavorlist[flavor.id] = flavor.get("ram") + " MB RAM | " + flavor.get("vcpus") + " VCPU | " + flavor.get("disk") + "GB Disk";
        }
        var POWER_STATES = {
            0: "NO STATE",
            1: "RUNNING",
            2: "BLOCKED",
            3: "PAUSED",
            4: "SHUTDOWN",
            5: "SHUTOFF",
            6: "CRASHED",
            7: "SUSPENDED",
            8: "FAILED",
            9: "BUILDING"
        };
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        var entries = [];
        for (var instance_idx in this.model.models) {
            var instance = this.model.models[instance_idx];

            var address = "";

            if (instance.get("addresses") != null && (instance.get("addresses")["public"] !== null || instance.get("addresses")["private"] !== null)) {
                var addresses = instance.get("addresses")["public"];
                for (var addr_idx in addresses) {
                    address += addresses[addr_idx].addr + "<br/>";
                }
                addresses = instance.get("addresses")["private"];
                for (var addr_idx2 in addresses) {
                    address += addresses[addr_idx2].addr + "<br/>";
                }
            }
            var entry = {
                id: instance.get('id'),
                cells: [{
                    value: instance.get("name"),
                    link: "#nova/instances/" + instance.id + "/detail"
                }, {
                    value: address
                }, {
                    value: flavorlist[instance.get("flavor").id]
                }, {
                    value: instance.get("paasStatus")
                }, {
                    value: instance.get("OS-EXT-STS:task_state") ? instance.get("OS-EXT-STS:task_state") : "None"
                }, {
                    value: POWER_STATES[instance.get("OS-EXT-STS:power_state")]
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onClose: function() {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("sync", this.render, this);
    },

    onAction: function(action, instanceIds) {
        var instance, inst, subview;
        var self = this;
        if (instanceIds.length === 1) {
            instance = instanceIds[0];
            inst = this.model.get(instance);
        }
        switch (action) {
            case 'add':
                break;
            case 'edit':
                subview = new UpdateInstanceView({
                    el: 'body',
                    model: inst
                });
                subview.render();
                break;
            case 'vnc':
                window.location.href = '#nova/instances/' + instance + '/detail?view=vnc';
                break;
            case 'log':
                window.location.href = 'nova/instances/' + instance + '/detail?view=log';
                break;
            case 'snapshot':
                subview = new CreateSnapshotView({
                    el: 'body',
                    model: this.model.get(instance)
                });
                subview.render();
                break;
            case 'password':
                subview = new ChangePasswordView({
                    el: 'body',
                    model: inst
                });
                subview.render();
                break;
            case 'pause':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Pause Instances",
                    btn_message: "Pause Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.pauseserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " paused.", "Error pausing instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'unpause':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Unpause Instances",
                    btn_message: "Unpause Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.unpauseserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " unpaused.", "Error unpausing instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'suspend':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Suspend Instances",
                    btn_message: "Suspend Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.suspendserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " suspended.", "Error suspending instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'resume':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Resume Instances",
                    btn_message: "Resume Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.resumeserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " resumed.", "Error resuming instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'reboot':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Reboot Instances",
                    btn_message: "Reboot Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.reboot(true, UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " rebooted.", "Error rebooting instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'terminate':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Terminate Instances",
                    btn_message: "Terminate Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            var options = UTILS.Messages.getCallbacks("VMs were succesfully added to tier", "Error adding VM to tier.");
                            var bp = self.options.blueprint;
                            options.instance_name = inst.get("name");
                            bp.removeVMFromTier(options);
                            //inst.destroy(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " terminated.", "Error terminating instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            default:
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models,
            flavors: this.options.flavors
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#blueprint-instance-tier-instances-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
        $('.btn-add-instances').qtip(this.qtip);
    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        $('.btn-add-instances').qtip(this.qtip);
        return this;
    }

});