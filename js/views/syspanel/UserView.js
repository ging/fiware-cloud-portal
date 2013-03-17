var UserView = Backbone.View.extend({

    _template: _.itemplate($('#usersTemplate').html()),
    timer: undefined,

    initialize: function() {
        var self = this;
        this.model.bind("reset", this.rerender, this);
        this.timer = setInterval(function() {
            self.model.fetch();
        }, 10000);
        this.render();
    },

    events: {
        'click .btn-edit-actions' : 'onUpdateUsers',
        'click .btn-delete-actions':'onDeleteGroup',
        'click .btn-disable-actions':'onDisableUsers',
        'click .btn-enable-actions':'onEnableUsers',
        'click .btn-create': 'onCreate',
        'click .btn-edit' : 'onUpdate',
        'click .btn-delete':'onDelete',
        'click .btn-disable':'onDisable',
        'click .btn-enable':'onEnable',
        //'click .btn-delete-group': 'onDeleteGroup',
        'change .checkbox_users':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll'
    },

    onUpdateUsers: function(evt) {
        var self = this;
        var user = $(".checkbox:checked").val();
        var usr = self.model.get(user);
        var subview = new EditUserView({el: 'body', model:usr, tenants: this.options.tenants});
        subview.render();
    },

    onDisableUsers: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Disable Users", btn_message: "Disable Users", onAccept: function() {
            $(".checkbox_users:checked").each(function () {
                    var user = $(this).val();
                    var usr = self.model.get(user);
                        if (usr.get("enabled") === true) {
                            usr.set("enabled", false);
                            usr.save();
                        }                    
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Users disabled"});
                    subview.render();
            });
        }});
        subview.render();
    },

    onEnableUsers: function(evt) {
        var self = this; 
        var subview = new ConfirmView({el: 'body', title: "Confirm Enable User", btn_message: "Enable User", onAccept: function() {
            $(".checkbox_users:checked").each(function () {
                    var user = $(this).val();
                    var usr = self.model.get(user);
                        if (usr.get("enabled") === false) {
                            usr.set("enabled", true);
                            //usr.save();
                        }
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Users enabled"});
                    subview.render();
            });
        }});
        subview.render();
    },

    onCreate: function() {
        var subview = new CreateUserView({el: 'body', model:this.model, tenants: this.options.tenants});
        subview.render();
    },

    onUpdate: function(evt) {
        var user = this.model.get(evt.target.value);
        var subview = new EditUserView({el: 'body', model:user, tenants: this.options.tenants});
        subview.render();
    },

    onDisable: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Disable User", btn_message: "Disable User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.set("enabled", false);
            user.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User disabled."});
            subview.render();

        }});
        subview.render();
    },

    onEnable: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Enable User", btn_message: "Enable User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.set("enabled", true);
            user.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User enabled."});
            subview.render();

        }});
        subview.render();
    },

    onDelete: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete User", btn_message: "Delete User", onAccept: function() {
            var user = self.model.get(evt.target.value);
            user.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "User deleted."});
            subview.render();

        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;          
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Users", btn_message: "Delete Users", onAccept: function() {
            $(".checkbox_users:checked").each(function () {
                    var user = $(this).val();
                    var usr = self.model.get(user);
                    usr.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "User deleted."});
                    subview.render();

            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_users").attr('checked','checked');
            $(".edit-actions").hide();
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_users").attr('checked',false);
            $(".edit-actions").show();
            this.enableDisableDeleteButton();
        }

    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_users:checked").size() > 0) {
            $("#users_delete").attr("disabled", false);
            $(".btn-edit-actions").attr("disabled", false);
            $(".btn-enable-actions").attr("disabled", false);
            $(".btn-disable-actions").attr("disabled", false);
            $(".btn-delete-actions").attr("disabled", false);  
                if ($(".checkbox_users:checked").size() > 1) {
                    $(".btn-edit-actions").hide();
                } else {
                    $(".btn-edit-actions").show();
                }        
        } else {
            $("#users_delete").attr("disabled", true);
            $(".btn-edit-actions").attr("disabled", true);
            $(".btn-enable-actions").attr("disabled", true);
            $(".btn-disable-actions").attr("disabled", true);
            $(".btn-delete-actions").attr("disabled", true);
            $(".btn-edit-actions").show();
        }
        

    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
        clearInterval(this.timer);
    },

    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },

    rerender: function() {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#users").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            var index, userId, check, drop, drop_actions_selected;
            for (index in this.model.models) {
                userId = this.model.models[index].id;
                if ($("#checkbox_"+userId).is(':checked')) {
                    checkboxes.push(userId);
                }
                if ($("#dropdown_"+userId).hasClass('open')) {
                    dropdowns.push(userId);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                }              
            }
            $(this.el).html(new_template);
            for (index in checkboxes) {
                userId = checkboxes[index];
                check = $("#checkbox_"+userId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            for (index in dropdowns) {
                userId = dropdowns[index];
                drop = $("#dropdown_"+userId);
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