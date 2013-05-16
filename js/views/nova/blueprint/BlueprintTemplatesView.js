var BlueprintTemplatesView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplatesTemplate').html()),

    tableView: undefined,

    initialize: function() {
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
        return [{label: "Open Catalog", url: "#nova/blueprints/catalog"},
                {label: "Create New Template", action: "create"}];
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
            label: "Launch Template",
            action: "launch",
            activatePattern: oneSelected
            }, {
            label: "Clone Template",
            action: "clone",
            activatePattern: oneSelected
            }, {
            label: "Delete Template",
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
            tooltip: "Template's name",
            size: "45%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Template's description",
            size: "45%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Tiers",
            tooltip: "Number of tiers defined in this tier",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
        this.model = {models:[{id:1}]};
        for (var index in this.model.models) {
            var template = this.model.models[index];
            i++;
            var entry = {
                id: template.id,
                cells: [{
                    value: "test",
                    link: "#nova/blueprints/" + template.id
                }, {
                    value: "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
                }, {
                    value: 3
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
            bp = blueprint;
        }
        switch (action) {
            case 'create':
                break;
            case 'launch':
                break;
            case 'clone':
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Blueprint Template",
                    btn_message: "Delete Blueprint Template",
                    onAccept: function() {
                        blueprintIds.forEach(function(blueprint) {
                            bp.destroy(UTILS.Messages.getCallbacks("Blueprint Template deleted", "Error deleting Blueprint Template."));
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
            el: '#blueprint-templates-table',
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