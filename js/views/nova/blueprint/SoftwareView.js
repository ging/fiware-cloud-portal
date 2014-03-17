var SoftwareView = Backbone.View.extend({

    _template: _.itemplate($('#softwareTemplate').html()),

    tableView: undefined,

    initialize: function() {
        var self = this;

        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Add new software",
            action: 'create'
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var privateOneSelected = function(size, id) {
            if (size === 1) {
                // TODO tiene que ser privado para poder editarse o borrarse
                return true;
            }
        };
        var privateGroupSelected = function(size, id) {
            if (size >= 1) {
                // TODO tiene que ser privado para poder editarse o borrarse
                return true;
            }
        };
        return [{
            label: "Edit Software",
            action: "edit",
            activatePattern: privateOneSelected
        }, {
            label: "Delete Software",
            action: "delete",
            warn: true,
            activatePattern: privateOneSelected
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Software Name",
            tooltip: "Software's name",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Version",
            tooltip: "Release version",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Visibility",
            tooltip: "Check if the software is open to the public",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Software's description",
            size: "45%",
            hidden_phone: true,
            hidden_tablet: true
        }];
    },

    getEntries: function() {
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        var entries = [];
        var models = this.model.models;
        for (var sft in models) {
            var entry = {
                id: sft,
                // TODO qué id usar
                cells: [{
                    value: models[sft].get('name')
                    //link: "#nova/instances/" + instance.id + "/detail"
                }, {
                    value: models[sft].get('version')
                    //link: "#nova/instances/" + instance.id + "/detail"
                }, {
                    // TODO ver campo public private
                    value: 'public'
                }, {
                    value: models[sft].get('description')
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

    onAction: function(action, sftIds) {
        var software, sft, subview;
        var self = this;
        if (sftIds.length === 1) {
            software = sftIds[0];
            sft = this.model.get(software);
        }
        switch (action) {
            case 'create':
                subview = new CreateSoftwareView({el: 'body', model: this.model});
                subview.render();
                break;
            case 'edit':
                // subview = new EditBlueprintView({el: 'body', model: bp});
                // subview.render();
                break;
            case 'delete':
                // subview = new ConfirmView({
                //     el: 'body',
                //     title: "Delete Software",
                //     btn_message: "Delete Software",
                //     onAccept: function() {
                //         sftIds.forEach(function(b) {
                //             var s = self.model.models[b];
                //             s.destroy(UTILS.Messages.getCallbacks("Software deleted", "Error deleting Software."));
                //         });
                //     }
                // });
                //subview.render();
                break;
            
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {
            //models: this.model.models,
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#software-table',
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