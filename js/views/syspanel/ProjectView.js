var ProjectView = Backbone.View.extend({

    _template: _.itemplate($('#projectsTemplate').html()),

    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.model.fetch();
        this.render();
    },

    events: {
        'click .btn-create-project' : 'onCreate',
        'click .btn-edit' : 'onUpdate',
        'click .btn-delete':'onDelete',
        'click .btn-delete-group': 'onDeleteGroup',
        'change .checkbox_projects':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll'
    },

    onCreate: function() {
        var subview = new CreateProjectView({el: 'body'});
        subview.render();
    },

    onUpdate: function(evt) {
        var project = this.model.get(evt.target.value);
        var subview = new EditProjectView({el: 'body', model:project});
        subview.render();
    },

    onDelete: function(evt) {
        var project = evt.target.value;
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Project", btn_message: "Delete Project", onAccept: function() {
            var proj = self.model.get(project);
            proj.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Project deleted."});
            subview.render();
        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Delete Projects", btn_message: "Delete Projects", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var project = $(this).val();
                    var proj = self.model.get(project);
                    proj.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Project deleted."});
                    subview.render();

            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_projects").attr('checked','checked');
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_projects").attr('checked',false);
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_projects:checked").size() > 0) {
            $("#projects_delete").attr("disabled", false);
        } else {
            $("#projects_delete").attr("disabled", true);
        }

    },

    onClose: function() {
        this.model.unbind("reset");
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($("#tenants").html() != null) {
            $(this.el).empty().html(this._template(this.model));
        } else {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        }
    }
});