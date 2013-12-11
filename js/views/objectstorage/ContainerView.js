var ObjectStorageContainerView = Backbone.View.extend({

    _template: _.itemplate($('#objectstorageContainerTemplate').html()),

    timer: undefined,

    initialize: function() {
        var self = this;
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.timer = setInterval(function() {
            self.model.fetch();
        }, 10000);
        this.model.fetch();
        this.renderFirst();

    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Upload Object",
            action: "upload"
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
            label: "Download Object",
            action: "download",
            activatePattern: oneSelected
        }, {
            label: "Copy Object",
            action: "copy",
            activatePattern: oneSelected
        }, {
            label: "Delete Object",
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
            tooltip: "Object's name",
            size: "70%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Object's size",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var container = this.model;
        var i = 0;
        for (var index in container.get('objects')) {
            var object = container.get('objects')[index];
            var bytes = object.bytes;
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
                id: object.name,
                cells: [{
                    value: object.name
                }, {
                    value: size
                }]
            };
            entries.push(entry);

        }
        return entries;
    },

    onAction: function(action, objectIds) {
        var object, obj, subview;
        var self = this;
        var container = this.options.model.get("name");
        if (objectIds.length === 1) {
            object = objectIds[0];
        }
        switch (action) {
            case 'upload':
                subview = new UploadObjectView({
                    el: 'body',
                    model: this.model
                });
                subview.render();
                break;
            case 'download':
                var options = {};
                var filename = object;
                options.callback = function(object) {
                    console.log("Downloaded");
                    var typeMIME, blob, blobURL;
                    var obj = JSON.parse(object);
                    
                    var byteString;
                    if (obj.valuetransferencoding === "base64") {
                        byteString = atob(obj.value);
                    } else {
                        byteString = obj.value;
                    }
                    var array = [];
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                      ia[i] = byteString.charCodeAt(i);
                    }
                    array.push(ab);
                    blob = new Blob(array, {type: obj.mimetype});
                    saveAs(blob, filename);
                    //blobURL = window.URL.createObjectURL(blob);
                    //window.open(blobURL);
                };
                this.model.downloadObject(object, options);
                break;
            case 'copy':
                subview = new CopyObjectView({
                    el: 'body',
                    model: this.model,
                    title: object,
                    container: this.model.get("name"),
                    containers: this.options.containers.models
                });
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Confirm Delete Object",
                    btn_message: "Delete Object",
                    onAccept: function() {
                        objectIds.forEach(function(object) {
                            self.model.deleteObject(object, {callback:function() {
                                var subview3 = new MessagesView({
                                    state: "Success",
                                    title: "Object " + object + " deleted."
                                });
                                subview3.render();
                            }});
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
        this.model.unbind("change", this.render, this);
        this.model.unbind("sync", this.render, this);
        clearInterval(this.timer);
    },

    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);
        this.tableView = new TableView({
            model: this.model,
            el: '#container-table',
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
