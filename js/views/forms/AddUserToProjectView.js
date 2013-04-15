var AddUserToProjectView = Backbone.View.extend({

    _template: _.itemplate($('#addUserToProjectFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'update',
      'click .modal-backdrop': 'close'
    },

    initialize: function() {
    },

    onClose: function() {
        $('#add_user').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#add_user').html() != null) {
            return;
        }
        $(this.el).append(this._template({roles: this.options.roles}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#add_user').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    update: function(e) {
        var roleReg;
        $("#id_role_id option:selected").each(function () {
                var role = $(this).val();
                if (role !== "") {
                    roleReg = role;
                }
        });
        var tenant = this.options.tenant.get('id');
        if (roleReg && tenant) {
            for (var user in this.options.users) {
                var usr = this.options.users[user];
                usr.addRole(roleReg, tenant, UTILS.Messages.getCallbacks("User "+usr.get("name") + " added.", "Error adding user "+usr.get("name"), {context: this}));
            }
        }

    }

});