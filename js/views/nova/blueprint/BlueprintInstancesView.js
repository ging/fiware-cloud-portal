var BlueprintInstancesView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstancesTemplate').html()),

    tableView: undefined,

    initialize: function() {
        //console.log("Instances:", this.model);
        if (this.model) {
            this.model.unbind("sync");
            this.model.bind("sync", this.render, this);
        }
        this.renderFirst();
    },

    events: {
        'click .btn-task': 'onGetTask'
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{label: "Launch New Blueprint", url: "#nova/blueprints/templates/"}];
    },

    getDropdownButtons: function() {
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
        return [{
            // label: "Start Instance",
            // action: "start",
            // activatePattern: oneSelected
            // },{
            // label: "Stop Instance",
            // action: "stop",
            // activatePattern: oneSelected
            // }, {
            label: "Terminate Instance",
            action: "delete",
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
            name: "Name",
            tooltip: "Instance's name",
            size: "35%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Instance's description",
            size: "35%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Tiers",
            tooltip: "Number of tiers defined in this tier",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the instances",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
        for (var index in this.model.models) {
            var bpInstance = this.model.models[index];
            i++;

            var nTiers = 0;
            if (bpInstance.get('tierDto_asArray')) {
                nTiers = bpInstance.get('tierDto_asArray').length;
            }

            var entry = {
                id: index,
                cells: [{
                    value: bpInstance.get('blueprintName'),
                    link: "#nova/blueprints/instances/" + bpInstance.get('blueprintName')
                }, {
                    value: bpInstance.get('description')
                }, {
                    value: nTiers
                }, {
                    value: bpInstance.get('status') + '<img src="/images/info_icon.png" id="bpInstance__action_task__'+i+'" class="ajax-modal btn-task" name="' + bpInstance.get('taskId')  +'"></img>'
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onGetTask: function(evt) {
        var taskId = evt.target.name;
        var options = UTILS.Messages.getCallbacks("", "Instance status information error.", {showSuccessResp: true, success: function() {
            if ( $('#message-resize-icon').hasClass('icon-resize-full')) {
                $('#message-resize-icon').click();    
            }
        }});
        options.taskId = taskId;
        this.model.getTask(options);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.tableView.close();
    },

    onAction: function(action, blueprintIds) {
        var blueprint, bp, subview;
        var self = this;
        if (blueprintIds.length === 1) {
            blueprint = blueprintIds[0];
            bp = this.model.models[blueprint];
        }
        switch (action) {
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Terminate Blueprint Instance",
                    btn_message: "Terminate Blueprint Instance",
                    onAccept: function() {
                        blueprintIds.forEach(function(blueprint) {
                            bp = self.model.models[blueprint];
                            bp.destroy(UTILS.Messages.getCallbacks("Blueprint Instance terminated", "Error terminating Blueprint Instance."));
                        });
                    }
                });
                subview.render();
                break;
            case 'other':
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableView({
            model: this.model,
            el: '#blueprint-instances-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }

});