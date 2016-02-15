var VolumeBackupsView = Backbone.View.extend({

    _template: _.itemplate($('#novaVolumeBackupsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "Volume Backup's name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Volume Backup's name",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Size of volume backup",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the backup (active, none, ...)",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Identifier of the corresponding volume",
            tooltip: "Backup's container format (AMI, AKI, ...)",
            size: "20%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Delete Backups",
            action: "delete",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var volBackup = this.model.models[index];
            var entry = {
                id: volBackup.get('id'),
                cells: [{
                    value: volBackup.get("display_name"),
                    link: "#nova/backups/volumes/" + volBackup.get("id")+ "/detail/"
                }, {
                    value: volBackup.get('description')
                }, {
                    value: volBackup.get('size')+" GB"
                }, {
                    value: volBackup.get("display_description")
                }, {
                    value: volBackup.get('volume_id')
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

    onAction: function(action, backupIds) {
        var backup, snap, subview;
        var self = this;
        if (backupIds.length === 1) {
            backup = backupIds[0];
            snap = this.model.get(backup);
        }
        switch (action) {
            case 'edit':
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Backups",
                    btn_message: "Delete Backups",
                    onAccept: function() {
                        backupIds.forEach(function(backup) {
                            snap = self.model.get(backup);
                            snap.destroy(UTILS.Messages.getCallbacks("Backup " + snap.get("name") + " deleted", "Error deleting backup " + snap.get("name")));
                        });
                    }
                });
                subview.render();
                break;
        }
    },

    renderFirst: function() {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        $(this.el).html(this._template({models:this.model.models, instancesModel:this.options.instancesModel, volumesModel:this.options.volumesModel, flavors:this.options.flavors}));
        //UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#volume-backups-table',
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