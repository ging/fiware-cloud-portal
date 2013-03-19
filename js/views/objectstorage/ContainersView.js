var ObjectStorageContainersView = Backbone.View.extend({

    _template: _.itemplate($('#objectstorageContainersTemplate').html()),

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events: {
        'click .btn-list-objects-actions' : 'onListObjects',
        'click .btn-delete-actions':'onDeleteGroup',
        'click .btn-upload-actions':'onUploadObject',
        'change .checkbox_containers':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
        'click .btn-create-container': 'onCreateContainer',
        'click .btn-upload': 'onUpload',
        'click .btn-delete':'onDelete'
    },

    onUploadObject: function(evt) {
        var self = this;
        var cont = $(".checkbox:checked").val();
        var container = self.model.get(cont);
        var subview = new UploadObjectView({el: 'body',  model: container});
        subview.render();
    },

    onListObjects: function(evt) {
        var container = $(".checkbox:checked").val();
        window.location.href = '#objectstorage/containers/'+container+'/';
    },

    onCreateContainer: function(evt) {
        var subview = new CreateContainerView({el: 'body', model:this.model});
        subview.render();
    },
    onUpload: function(evt) {
        var self = this;
        var cont = self.model.get(evt.target.value);
        var subview = new UploadObjectView({el: 'body',  model: cont});
        subview.render();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    onDelete: function(evt) {
        var container = evt.target.value;
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Container", btn_message: "Delete Container", onAccept: function() {
            cont = self.model.get(container);
                if (cont.get("count")>0) {
                    console.log(cont);
                    var subview2 = new MessagesView({el: '#content', state: "Error", title: "Unable to delete non-empty container "+cont.get("id")});
                    subview2.render();
                    return;
                } else {
                cont.destroy();

                var subview3 = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("id")+" deleted."});
                subview3.render();
                }
        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Delete Containers", btn_message: "Delete Containers", onAccept: function() {
            $(".checkbox_containers:checked").each(function () {
                    var container = $(this).val();

                    cont = self.model.get(container);
                    if (cont.get("count")>0) {
                        var subview2 = new MessagesView({el: '#content', state: "Conflict", title: "Container "+cont.get("id")+" contains objects."});
                        subview2.render();
                        return;
                    } else {
                    cont.destroy();
                    var subview3 = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("name")+" deleted."});
                    subview3.render();
                   }
            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_containers").attr('checked','checked');
            $(".btn-list-objects-actions").hide();
            $(".btn-upload-actions").hide();
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_containers").attr('checked',false);
            $(".btn-list-objects-actions").show();
            $(".btn-upload-actions").show();
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_containers:checked").size() > 0) {
            $("#containers_terminate").attr("disabled", false);
            $(".btn-list-objects-actions").attr("disabled", false);
            $(".btn-upload-actions").attr("disabled", false);
            $(".btn-delete-actions").attr("disabled", false);

            if ($(".checkbox_containers:checked").size() > 1) {
                $(".btn-list-objects-actions").attr("disabled", true);
                $(".btn-upload-actions").attr("disabled", true);
            } else {
                $(".btn-list-objects-actions").attr("disabled", false);
                $(".btn-upload-actions").attr("disabled", false);
            }
        } else {
            $("#containers_terminate").attr("disabled", true);
            $(".btn-list-objects-actions").attr("disabled", true);
            $(".btn-upload-actions").attr("disabled", true);
            $(".btn-delete-actions").attr("disabled", true);
            $(".btn-list-objects-actions").attr("disabled", true);
            $(".btn-upload-actions").attr("disabled", true);
        }
    },

    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
        this.enableDisableDeleteButton();
    },

    render: function () {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#containers").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            var container, check, drop, drop_actions_selected, index;
            for (index in this.model.models) {
                container = this.model.models[index].id;
                if ($("#checkbox_"+container).is(':checked')) {
                    checkboxes.push(container);
                }
                if ($("#dropdown_"+container).hasClass('open')) {
                    dropdowns.push(container);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                }
            }
            var scrollTo = $(".scrollable").scrollTop();
            $(this.el).html(new_template);
            $(".scrollable").scrollTop(scrollTo);
            for (index in checkboxes) {
                container = checkboxes[index];
                check = $("#checkbox_"+container);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            for (index in dropdowns) {
                container = dropdowns[index];
                drop = $("#dropdown_"+container);
                if (drop.html() !== null) {
                    drop.addClass("open");
                }
            }
            if (($("#dropdown_actions").html() !== null) && (drop_actions_selected)) {
                $("#dropdown_actions").addClass("open");
            }
            this.enableDisableDeleteButton();
        }

        return this;
    }
});