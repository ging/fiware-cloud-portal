var ObjectStorageContainerView = Backbone.View.extend({

    _template: _.itemplate($('#objectstorageContainerTemplate').html()),

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("change", this.renderFirst, this);
        this.model.bind("reset", this.render, this);
        this.model.fetch();

    },

    events: {
        'change .checkbox_objects': 'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
        'click .btn-upload': 'onUploadObject',
        'click .btn-copy' : 'onCopyObject',
        'click .btn-download' : 'onDownloadObject',
        'click .btn-delete':'onDelete',
        'click #objects_delete': 'onDeleteGroup'
    },

    onDownloadObject: function() {
        var self, url, urlAux, contaier, objName;
        self = this;

        url = $(".btn-download").attr("href");
        urlAux = url.split('/');
        cont = urlAux[urlAux.length-2];
        obj = urlAux[urlAux.length-1];

        mySucess = function(object) {

            var typeMIME, blob, blobURL;
            blob = new Blob([object], { type: "application/cdmi-object" });
            blobURL = window.URL.createObjectURL(blob);
            window.open(blobURL);
        };
        CDMI.Actions.downloadobject(cont, obj, mySucess);
    },

    onUploadObject: function(evt) {
        var subview = new UploadObjectView({el: 'body', model: this.model});
        subview.render();
    },

    onCopyObject: function(evt) {
        this.options.title = evt.target.value;
        var containerName = this.options.model.get("name");
        var subview = new CopyObjectView({el: 'body', model: this.model, title: this.options.title, container: containerName, containers: this.options.containers.models});
        subview.render();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    onDelete: function(evt) {
        var obj, container;
        var self = this;
        for (var index in this.model.get("objects")) {
             if (this.model.get("objects")[index].name === evt.target.value) {
                obj = this.model.get("objects")[index];
             }
        }
        //obj = object;
        container = (this.model.get("name"));
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Object", btn_message: "Delete Object", onAccept: function() {
            self.model.deleteObject(container,obj);
            var subview = new MessagesView({el: '#content', state: "Success", title: "Object "+obj.name+" deleted."});
            subview.render();
        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var container;
        var objs= [];
        var subview = new ConfirmView({el: 'body', title: "Delete Objects", btn_message: "Delete Objects", onAccept: function() {
            var objects = [];
            $(".checkbox_objects:checked").each(function () {
                    var object = $(this).val();
                    var obj = self.model.get('objects')[object];
                    objects.push(obj);
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Object "+obj.name+" deleted."});
                    subview.render();
            });
            objs = objects;
            container = (self.model.get("name"));
            self.model.deleteObjects(container, objs);
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_objects").attr('checked','checked');
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_objects").attr('checked',false);
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_objects:checked").size() > 0) {
            $("#objects_delete").attr("disabled", false);
        } else {
            $("#objects_delete").attr("disabled", true);
        }

    },

    render: function () {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#objects").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var objectId, index, check;
            for (index in this.model.models) {
                objectId = this.model.models[index].id;
                if ($("#checkbox_"+objectId).is(':checked')) {
                    checkboxes.push(objectId);
                }
            }
            $(this.el).html(new_template);
            for (index in checkboxes) {
                objectId = checkboxes[index];
                check = $("#checkbox_"+objectId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            this.enableDisableDeleteButton();
        }
         this.delegateEvents(this.events);
        return this;
    },

    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {model: this.model, models:this.model.get("objects")});

    }
});