var ImagesView = Backbone.View.extend({

    _template: _.itemplate($('#imagesTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.options.volumeSnapshotsModel = UTILS.GlobalModels.get("volumeSnapshotsModel");
        this.options.instancesModel = UTILS.GlobalModels.get("instancesModel");
        this.options.volumesModel = UTILS.GlobalModels.get("volumesModel");
        this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.options.keypairs = UTILS.GlobalModels.get("keypairsModel");
        this.options.secGroups = UTILS.GlobalModels.get("securityGroupsModel");
        this.options.quotas = UTILS.GlobalModels.get("quotas");
        this.options.networks = UTILS.GlobalModels.get("networks");
        this.options.ports = UTILS.GlobalModels.get("ports");
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    events: {
        'click .btn-launch': 'onLaunch'
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
                var owner = model.get("owner_id") || model.get("owner");
                if (owner === UTILS.Auth.getCurrentTenant().id && model.get("status") === "active") {
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
            label: "Edit Image",
            action: "edit",
            activatePattern: editable
        }, {
            label: "Delete Image",
            action: "delete",
            warn: true,
            activatePattern: editable
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            name: "Name",
            tooltip: "Image's name",
            size: "35%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Image's status: building, active, ...",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Visibility",
            tooltip: "Check if the image is open to the public",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Container Format",
            tooltip: "Image's container format",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Disk Format",
            tooltip: "Image's disk format",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Actions",
            tooltip: "Actions",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false,
            order: "none"
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
            for (var index in this.model.models) {
            var image = this.model.models[index];
            if (image.get('server') !== undefined || image.get('container_format') === 'ari' || image.get('container_format') === 'aki') {
                continue;
            }
            var container_format = image.get('container_format') || '-';
            container_format = container_format.toUpperCase();
            var disk_format = image.get('disk_format') || '-';
            disk_format = disk_format.toUpperCase();
            i++;
            var visibility = image.get('visibility');
            if (visibility === undefined) {
                visibility = image.get('is_public') ? "public":"private";
            }
            var entry = {
                id: image.get('id'),
                cells: [{
                    value: image.get("name"),
                    link: "#nova/images/" + image.id
                }, {
                    value: image.get("status")
                }, {
                    value: visibility
                }, {
                    value: container_format
                }, {
                    value: disk_format
                }, {
                    value: '<button  id="images__action_launch__'+i+'" class="ajax-modal btn btn-small btn-blue btn-launch" name="action" value="' + image.id + '" type="submit" data-i18n="Launch">Launch</button>'
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

    onAction: function(action, imageIds) {
        var image, img, subview;
        var self = this;
        if (imageIds.length === 1) {
            image = imageIds[0];
            img = this.model.get(image);
        }
        switch (action) {
            case 'edit':
                subview = new UpdateImageView({
                    model: img,
                    el: 'body'
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Image",
                    btn_message: "Delete Image",
                    onAccept: function() {
                        imageIds.forEach(function(image) {
                            img = self.model.get(image);
                            img.destroy(UTILS.Messages.getCallbacks("Image " + img.get("name") + " deleted", "Error deleting image " + img.get("name")));
                        });
                    }
                });
                subview.render();
                break;
        }
    },

    onLaunch: function(evt) {
        var image = evt.target.value;
        var img = this.model.get(image);
        //pendiente de metadato sdc_aware
        img.set({'properties':{}});
        var self = this;
        var subview = new LaunchImageView({el: 'body', images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.options.quotas, instancesModel: this.options.instancesModel, networks: this.options.networks, tenant: this.options.tenant, volumes: this.options.volumesModel, volumeSnapshots: this.options.volumeSnapshotsModel, ports: this.options.ports, model: img});
        subview.render();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#images-table',
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