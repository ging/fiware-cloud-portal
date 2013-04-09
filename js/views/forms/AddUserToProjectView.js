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
        $(this.el).append(this._template({model:this.model, roles: this.options.roles}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
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
        console.log(tenant);
        if (roleReg && tenant) {
            this.model.addRole(roleReg, tenant);
            var subview = new MessagesView({state: "Success", title: "User Added."});
            subview.render();
            this.close();
        }

    }

});