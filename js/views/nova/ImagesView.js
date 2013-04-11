var ImagesView = Backbone.View.extend({

    _template: _.itemplate($('#imagesTemplate').html()),

    tableView: undefined,

    initialize: function() {
         this.model.unbind("reset");
         this.model.bind("reset", this.render, this);
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
        return [];
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
            name: "Public",
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
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var i = 0;
            for (var index in this.model.models) {
            var image = this.model.models[index];
            if (image.get('server') !== undefined) {
                continue;
            }
            var container_format = image.get('container_format') || '-';
            container_format = container_format.toUpperCase();
            var disk_format = image.get('disk_format') || '-';
            disk_format = disk_format.toUpperCase();
            i++;
            var entry = {
                id: image.get('id'),
                cells: [{
                    value: image.get("name"),
                    link: "#nova/images/" + image.id
                }, {
                    value: image.get("status")
                }, {
                    value: image.get('is_public')
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
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Delete Image",
                    btn_message: "Delete Image",
                    onAccept: function() {
                        imageIds.forEach(function(image) {
                            img = self.model.get(image);
                            img.destroy();
                            subview = new MessagesView({
                                state: "Success",
                                title: "Image " + img.get("name") + " deleted."
                            });
                            subview.render();
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
        var self = this;
        console.log('Showing Instance Creation');
        var subview = new LaunchImageView({el: 'body', images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, model: img});
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