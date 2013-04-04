var NovaVolumesView = Backbone.View.extend({

    _template: _.itemplate($('#novaVolumesTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Create Volume",
            action: "create"
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                var entry = self.model.get(id);
                if (entry.get("status") !== "error") {
                    return true;
                }
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        var attachSelected = function(size, id) {
            if (size === 1) {
                var entry = self.model.get(id);
                if (entry.get("status") === "available") {
                    return true;
                }
            }
        };
        var groupAttachSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") === "in-use") {
                        return false;
                    }
                }
                return true;
            }
        };
        return [{
                label: "Edit Attachments",
                action: "attachment",
                activatePattern: oneSelected
            }, {
                label: "Create Snapshot",
                action: "snapshot",
                activatePattern: attachSelected
            }, {
                label: "Delete Volumes",
                action: "delete",
                warn: true,
                activatePattern: groupAttachSelected
            }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
                type: "checkbox",
                size: "5%"
            }, {
                name: "Name",
                tooltip: "Volume's name",
                size: "25%",
                hidden_phone: false,
                hidden_tablet: false
            }, {
                name: "Description",
                tooltip: "Volume's Description",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            }, {
                name: "Size",
                tooltip: "Current volume size",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            }, {
                name: "Status",
                tooltip: "Current volume status (available, none, ...)",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            }, {
                name: "Attachments",
                tooltip: "Servers the snapshot is attached to",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            }];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var volume = this.model.models[index];
            var entry = {
                id: volume.get('id'),
                cells: [{
                    value: volume.get("display_name"),
                    link: "#nova/images_and_snapshots/volumes/" + volume.get("id") + "/detail"
                }, {
                    value: (volume.get("display_description") !== '' && volume.get('display_description')!== null) ? volume.get("display_description"):'-'
                }, {
                    value: volume.get('size')+" GB"
                }, {
                    value: volume.get("status")
                }, {
                    value: (volume.get("attachments").length === 0) ? "-": volume.get("attachments").length
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("reset", this.render, this);
    },

    onAction: function(action, volumeIds) {
        var volume, vol, subview;
        var self = this;
        if (volumeIds.length === 1) {
            volume = volumeIds[0];
            vol = this.model.get(volume);
        }
        switch (action) {
            case 'attachment':
                subview = new EditVolumeAttachmentsView({el: 'body', model: vol, instances: this.options.instancesModel});
                subview.render();
                break;
            case 'create':
                subview = new CreateVolumeView({el: 'body'});
                subview.render();
                break;
            case 'snapshot':
                subview = new CreateVolumeSnapshotView({el: 'body', model: volume});
                subview.render();
                break;
            case 'delete':
               break;
        }
    },

    onEditAttachments: function(evt) {
        var self = this;
        var vol = $(".checkbox:checked").val();
        var volume = self.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instancesModel});
        subview.render();
    },

    onCreate: function(evt) {
        var subview = new CreateVolumeView({el: 'body'});
        subview.render();
    },
    onCreateSnapshot: function(evt) {
        var volumeSnapshot = evt.target.value;
        var volumeSnap = this.model.get(volumeSnapshot);
        var subview = new CreateVolumeSnapshotView({el: 'body', model: volumeSnap});
        subview.render();
    },

    onEdit: function(evt) {
        var vol = evt.target.getAttribute("value");
        var volume = this.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instancesModel});
        subview.render();
    },

    onDelete: function(evt) {
        var volume = evt.target.value;
        var vol = this.model.get(volume);
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volume", onAccept: function() {
            vol.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});
            subview.render();
        }});

        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volumes", onAccept: function() {
            $(".checkbox_volumes:checked").each(function () {
                    var volume = $(this).val();
                    var vol = self.model.get(volume);
                    vol.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});
                    subview.render();
            });
        }});
        subview.render();
    },

    renderFirst: function() {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models, volumeSnapshotsModel:this.options.volumeSnapshotModel, instances: this.options.instancesModel});
        this.tableView = new TableView({
            model: this.model,
            el: '#volumes-table',
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
        console.log("Rendering");
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }

});