var ProjectView = Backbone.View.extend({

    _template: _.itemplate($('#projectsTemplate').html()),

    initialize: function() {
        var self = this;
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.options.quotas.unbind("reset");
        this.options.quotas.bind("reset", this.render, this);
        this.model.fetch();
        this.options.quotas.fetch();        
    },

    events: {
        'click .btn-edit-actions' : 'onUpdateProject',
        'click .btn-delete-projects-actions':'onDeleteGroup',
        'click .btn-modify-users-actions':'onModifyUsers',
        'click .btn-create-project' : 'onCreate',
        'click .btn-edit' : 'onUpdate',
        'click .btn-delete':'onDelete',
        //'click .btn-delete-group': 'onDeleteGroup',
        'click .btn-modify-quotas': 'onModifyQuotas',
        'change .checkbox_projects':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll'
    },  

    onUpdateProject: function(evt) {
        var self = this;
        var pro = $(".checkbox:checked").val();
        var project = self.model.get(pro);
        var subview = new EditProjectView({el: 'body', model:project});
        subview.render();
    },

    onModifyUsers: function(evt) {
        var project = $(".checkbox:checked").val();
        window.location.href = '#syspanel/projects/'+project+'/users/';
    },

    onModifyQuotas: function(evt) {
        var subview = new ModifyQuotasView({el: 'body', model:this.options.quotas.models[0], project: evt.target.value});
        subview.render();
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
            $(".checkbox_projects:checked").each(function () {
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
            $(".btn-edit-actions").hide();
            $(".btn-modify-users-actions").hide();
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_projects").attr('checked',false);
            $(".btn-edit-actions").show();
            $(".btn-modify-users-actions").show();
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_projects:checked").size() > 0) {
            $("#projects_delete").attr("disabled", false);
            $(".btn-edit-actions").attr("disabled", false);
            $(".btn-modify-users-actions").attr("disabled", false);
            $(".btn-delete-projects-actions").attr("disabled", false);             
            if ($(".checkbox_projects:checked").size() > 1) {
                    $(".btn-edit-actions").hide();
                    $(".btn-modify-users-actions").hide();
                } else {
                    $(".btn-edit-actions").show();
                    $(".btn-modify-users-actions").show();
                }        
        } else {
            $("#projects_delete").attr("disabled", true);
            $(".btn-modify-users-actions").attr("disabled", true);
            $(".btn-delete-projects-actions").attr("disabled", true); 
            $(".btn-edit-actions").attr("disabled", true);
            $(".btn-edit-actions").show();
        }

    },

    onClose: function() {
        this.model.unbind("reset");
        this.undelegateEvents();
        this.unbind();
    },


    render: function () {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#tenants").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            var index, tenantId, check, drop, drop_actions_selected;
            for (index in this.model.models) {
                tenantId = this.model.models[index].id;
                if ($("#checkbox_"+tenantId).is(':checked')) {
                    checkboxes.push(tenantId);
                }
                if ($("#dropdown_"+tenantId).hasClass('open')) {
                    dropdowns.push(tenantId);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                }              
            }
            $(this.el).html(new_template);
            for (index in checkboxes) {
                tenantId = checkboxes[index];
                check = $("#checkbox_"+tenantId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            for (index in dropdowns) {
                tenantId = dropdowns[index];
                drop = $("#dropdown_"+tenantId);
                if (drop.html() !== null) {
                    drop.addClass("open");
                }
            }
            if (($("#dropdown_actions").html() !== null) && (drop_actions_selected)) {
                $("#dropdown_actions").addClass("open");
            }
            this.enableDisableDeleteButton();

        } else {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        }

        return this;
    
    }
});