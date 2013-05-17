var BlueprintTemplatesCatalogView = Backbone.View.extend({

    _template: _.itemplate($('#blueprintTemplatesCatalogTemplate').html()),

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
        return [{label: "Close Catalog", url: "#nova/blueprints/", cssclass: "btn-catalog"}];
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
            label: "Clone Template",
            action: "clone",
            activatePattern: oneSelected
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

        for (var index in this.model.catalogList) {
            var template = this.model.catalogList[index];
            var nTiers = 0;
            if (template.tierDtos_asArray) {
                nTiers = template.tierDtos_asArray.length;
            }
            var entry = {
                id: index,
                cells: [{
                    value: template.name,
                    link: "#nova/blueprints/catalog/" + template.name,
                    cssclass: "link-catalog"
                }, {
                    value: template.description
                }, {
                    value: nTiers
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
            bp = this.model.catalogList[blueprint];
        }
        switch (action) {
            case 'clone':
                subview = new CloneBlueprintView({el: 'body', model: bp});
                subview.render();
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableView({
            model: this.model,
            el: '#blueprint-templatesCatalog-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this,
            dropdown_buttons_class: "btn-catalog"
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