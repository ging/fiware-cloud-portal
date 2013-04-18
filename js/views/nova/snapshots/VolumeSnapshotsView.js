var NovaVolumeSnapshotsView = Backbone.View.extend({

    _template: _.itemplate($('#novaVolumeSnapshotsTemplate').html()),

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
            tooltip: "Volume Snapshot's name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Volume Snapshot's name",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Size of volume snapshot",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the snapshot (active, none, ...)",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Identifier of the corresponding volume",
            tooltip: "Snapshot's container format (AMI, AKI, ...)",
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
            label: "Delete Snapshots",
            action: "delete",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var volSnapshot = this.model.models[index];
            var entry = {
                id: volSnapshot.get('id'),
                cells: [{
                    value: volSnapshot.get("display_name"),
                    link: "#nova/images_and_snapshots/" + volSnapshot.get("id")
                }, {
                    value: volSnapshot.get('description')
                }, {
                    value: volSnapshot.get('size')+" GB"
                }, {
                    value: volSnapshot.get("display_description")
                }, {
                    value: volSnapshot.get('volume_id')
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

    onAction: function(action, snapshotIds) {
        var snapshot, snap, subview;
        var self = this;
        if (snapshotIds.length === 1) {
            snapshot = snapshotIds[0];
            snap = this.model.get(snapshot);
        }
        switch (action) {
            case 'edit':
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Snapshots",
                    btn_message: "Delete Snapshots",
                    onAccept: function() {
                        snapshotIds.forEach(function(snapshot) {
                            snap = self.model.get(snapshot);
                            snap.destroy(UTILS.Messages.getCallbacks("Snapshot " + snap.get("name") + " deleted", "Error deleting snapshot " + snap.get("name")));
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
            el: '#volume-snapshots-table',
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