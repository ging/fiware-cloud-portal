var NovaInstanceSnapshotsView = Backbone.View.extend({

    _template: _.itemplate($('#novaInstanceSnapshotsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
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
            activatePattern: oneSelected
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
            if (image.get('metadata')) {
                var image_type = image.get('metadata').image_type;
                if (image_type == "snapshot") {
                    var entry = {
                        id: image.get('id'),
                        cells: [{
                            value: image.get("name"),
                            link: "#nova/images_and_snapshots/" + image.get("id")
                        }, {
                            value: "Snapshot"
                        }, {
                            value: image.get('status').toLowerCase()
                        }, {
                            value: "Yes"
                        }, {
                            value: "AMI"
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
        this.model.unbind("reset", this.render, this);
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
                            snap.destroy();
                            subview = new MessagesView({
                                el: '#content',
                                state: "Success",
                                title: "Snapshot " + snap.get("name") + " deleted."
                            });
                            subview.render();
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