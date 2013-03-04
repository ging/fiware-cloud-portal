var EditUserView = Backbone.View.extend({

    _template: _.itemplate($('#editUserFormTemplate').html()),

    events: {
        'click .update-user': 'onUpdate',
        'click #cancelBtn': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_user').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_user').html() != null) {
            $('#edit_user').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model, tenants: this.options.tenants}));

        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var name = this.$('input[name=name]').val();
        var email = this.$('input[name=email]').val();
        var password = this.$('input[name=user_password]').val();
        var tenant_name;
        $("#project_switcher option:selected").each(function () {
                var tenant = $(this).val();
                if (tenant !== "") {
                    tenant_id = tenant;
                }
        });
        this.model.set({'name': name});
        this.model.set({'email': email});
        if (password !== "") {
            this.model.set({'password': password});
        }
        this.model.set({'tenant_id': tenant_id});
        this.model.set({'enabled': true});
        this.model.save();
        subview = new MessagesView({el: '#content', state: "Success", title: "User "+this.model.get('name')+" created."});
        subview.render();
        this.close();
    }

});