var BlueprintInstancesView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintInstancesTemplate').html()),

    tableView: undefined,

    initialize: function() {
        console.log(this.model);
        if (this.model) {
            this.model.unbind("sync");
            this.model.bind("sync", this.render, this);
        }
        this.renderFirst();
    },

    events: {
        'click .btn-launch': 'onLaunch'
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
            label: "Start Instance",
            action: "start",
            activatePattern: oneSelected
            },{
            label: "Stop Instance",
            action: "stop",
            activatePattern: oneSelected
            }, {
            label: "Delete Instance",
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
            size: "45%",
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
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
        for (var index in this.model.models) {
            var template = this.model.models[index];
            i++;

            var nTiers = 0;
            if (template.get('tierDto_asArray')) {
                nTiers = template.get('tierDto_asArray').length;
            }

            var entry = {
                id: index,
                cells: [{
                    value: template.get('name'),
                    link: "#nova/blueprints/instances/" + template.get('name')
                }, {
                    value: template.get('description')
                }, {
                    value: nTiers
                }, {
                    value: "running"
                }]
            };
            entries.push(entry);
        }
        return entries;
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
            case 'create':
                subview = new CreateBlueprintView({el: 'body'});
                subview.render();
                break;
            case 'launch':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Launch Blueprint Template",
                    btn_message: "Launch Blueprint Template",
                    onAccept: function() {
                        blueprintIds.forEach(function(blueprint) {
                            //bp.launch(UTILS.Messages.getCallbacks("Blueprint Template launched", "Error launching Blueprint Template."));
                        });
                    }
                });
                subview.render();
                break;
            case 'clone':
                subview = new CloneBlueprintView({el: 'body', model: bp});
                subview.render();
                break;
            case 'edit':
                subview = new EditBlueprintView({el: 'body', model: bp});
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Blueprint Template",
                    btn_message: "Delete Blueprint Template",
                    onAccept: function() {
                        blueprintIds.forEach(function(blueprint) {
                            //bp.destroy(UTILS.Messages.getCallbacks("Blueprint Template deleted", "Error deleting Blueprint Template."));
                        });
                    }
                });
                subview.render();
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