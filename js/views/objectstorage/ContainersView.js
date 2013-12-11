var ObjectStorageContainersView = Backbone.View.extend({

    _template: _.itemplate($('#objectstorageContainersTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Create Container",
            action: "create"
        }];
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
            label: "List Objects",
            action: "list",
            activatePattern: oneSelected
        }, {
            label: "Upload Objects",
            action: "upload",
            activatePattern: oneSelected
        }, {
            label: "Delete Containers",
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
            tooltip: "Container's name",
            size: "50%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Objects",
            tooltip: "Number of objects on the container",
            size: "15%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Current size of the container",
            size: "30%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var container = this.model.models[index];
            var bytes = container.get("bytes");
            var kbytes, mbytes, gbytes, size;
            if (bytes >= 1024) {
                kbytes = Math.round(bytes / 1024 * 10) / 10;
                size = kbytes + " KB";
                if (kbytes >= 1024) {
                    mbytes = Math.round(kbytes / 1024 * 10) / 10;
                    size = mbytes + " MB";
                    if (mbytes >= 1024) {
                        gbytes = Math.round(mbytes / 1024 * 10) / 10;
                        size = gbytes + " GB";
                    } else {
                        size = Math.round(mbytes * 10) / 10 + " MB";
                    }
                } else {
                    size = Math.round(kbytes * 10) / 10 + " KB";
                }
            } else {
                size = Math.round(bytes * 10) / 10 + " bytes";
            }

            var entry = {
                id: container.get('name'),
                cells: [{
                    value: container.get("name"),
                    link: "#objectstorage/containers/" + container.get('name') + "/"
                }, {
                    value: container.get("count")
                }, {
                    value: size
                }]
            };
            entries.push(entry);

        }
        return entries;
    },

    onAction: function(action, containerIds) {
        var container, cont, subview;
        var self = this;
        if (containerIds.length === 1) {
            container = containerIds[0];
            cont = this.model.get(container);
        }
        switch (action) {
            case 'create':
                subview = new CreateContainerView({
                    el: 'body',
                    model: this.model
                });
                subview.render();
                break;
            case 'list':
                window.location.href = '#objectstorage/containers/' + container + '/';
                break;
            case 'upload':
                subview = new UploadObjectView({
                    el: 'body',
                    model: cont
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Delete Container",
                    btn_message: "Delete Container",
                    onAccept: function() {
                        containerIds.forEach(function(container) {
                            cont = self.model.get(container);
                            if (cont.get("count") > 0) {
                                console.log(cont);
                                var subview2 = new MessagesView({
                                    state: "Error",
                                    title: "Unable to delete non-empty container " + cont.get("id")
                                });
                                subview2.render();
                                return;
                            } else {
                                cont.destroy();

                                var subview3 = new MessagesView({
                                    state: "Success",
                                    title: "Container " + cont.get("id") + " deleted."
                                });
                                subview3.render();
                            }
                        });
                    }
                });
                subview.render();
                break;
        }
    },


    onClose: function() {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("sync", this.render, this);
    },

    onDelete: function(evt) {
        var container = evt.target.value;
        var self = this;
        var cont;
        var subview = new ConfirmView({
            el: 'body',
            title: "Confirm Delete Container",
            btn_message: "Delete Container",
            onAccept: function() {
                cont = self.model.get(container);
                if (cont.get("count") > 0) {
                    console.log(cont);
                    var subview2 = new MessagesView({
                        state: "Error",
                        title: "Unable to delete non-empty container " + cont.get("id")
                    });
                    subview2.render();
                    return;
                } else {
                    cont.destroy();

                    var subview3 = new MessagesView({
                        state: "Success",
                        title: "Container " + cont.get("id") + " deleted."
                    });
                    subview3.render();
                }
            }
        });
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({
            el: 'body',
            title: "Delete Containers",
            btn_message: "Delete Containers",
            onAccept: function() {
                $(".checkbox_containers:checked").each(function() {
                    var container = $(this).val();

                    cont = self.model.get(container);
                    if (cont.get("count") > 0) {
                        var subview2 = new MessagesView({
                            state: "Conflict",
                            title: "Container " + cont.get("id") + " contains objects."
                        });
                        subview2.render();
                        return;
                    } else {
                        cont.destroy();
                        var subview3 = new MessagesView({
                            state: "Success",
                            title: "Container " + cont.get("name") + " deleted."
                        });
                        subview3.render();
                    }
                });
            }
        });
        subview.render();
    },

    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#containers-table',
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