var NovaInstanceSnapshotsView = Backbone.View.extend({

    _template: _.itemplate($('#novaInstanceSnapshotsTemplate').html()),

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

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var editable = function(size, id) {
            if (oneSelected(size, id)) {
                var model = self.model.get(id);
                var owner = model.get("owner_id") || model.get("metadata").owner_id;
                console.log(owner, UTILS.Auth.getCurrentTenant().id);
                if (owner === UTILS.Auth.getCurrentTenant().id && model.get("status").toLowerCase() === "active") {
                    return true;
                }
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Launch Instance",
            action: "launch",
            activatePattern: oneSelected
        }, {
            label: "Edit Image",
            action: "edit",
            activatePattern: editable
        }, {
            label: "Delete Snapshots",
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
            tooltip: "Snapshot's name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Type",
            tooltip: "Snapshot's type",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current status of the snapshot (active, saving, ...)",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Public",
            tooltip: "Check if the Snapshot is publicly available",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Container Format",
            tooltip: "Snapshot's container format (AMI, AKI, ...)",
            size: "20%",
            hidden_phone: true,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var image = this.model.models[index];
            var entry;
            if (image.get('image_type') === "snapshot") {
                entry = {
                    id: image.get('id'),
                    cells: [{
                        value: image.get("name"),
                        link: "#nova/snapshots/instances/" + image.get("id") + "/detail/"
                    }, {
                        value: image.get('image_type')
                    }, {
                        value: image.get('status').toLowerCase()
                    }, {
                        value: image.get('visibility') === "public" ? "Yes" : "No"
                    }, {
                        value: image.get('container_format').toUpperCase()
                    }]
                };
                entries.push(entry);
            } else if (image.get('metadata') && image.get('metadata').image_type === "snapshot") {
                if (image.get('metadata').owner_id !== JSTACK.Keystone.params.access.token.tenant.id && !image.get('is_public')) {
                    continue;
                } else {
                    entry = {
                        id: image.get('id'),
                        cells: [{
                            value: image.get("name"),
                            link: "#nova/snapshots/instances/" + image.get("id") + "/detail/"
                        }, {
                            value: image.get('metadata').image_type
                        }, {
                            value: image.get('status').toLowerCase()
                        }, {
                            value: image.get('is_public') ? "Yes" : "No"
                        }, {
                            value: (image.get('container_format') || "-").toUpperCase()
                        }]
                    };
                    entries.push(entry);
                }
            }
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
            case 'launch':
                subview = new LaunchImageView({
                    model: snap,
                    flavors: this.options.flavors,
                    keypairs: this.options.keypairs,
                    secGroups: this.options.secGroups,
                    quotas: this.options.quotas,
                    instancesModel: this.options.instancesModel,
                    volumes: this.options.volumes,
                    el: 'body'
                });
                subview.render();
                break;
            case 'edit':
                subview = new UpdateImageView({
                    model: snap,
                    el: 'body'
                });
                subview.render();
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
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#instance-snapshots-table',
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