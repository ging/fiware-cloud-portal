var CreateUserView = Backbone.View.extend({

    _template: _.itemplate($('#createUserFormTemplate').html()),

    events: {
        'click .create-user': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#create_user').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_user').html() != null) {
            $('#create_user').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({tenants:this.options.tenants}));
        $('.modal:last').modal();
        return this;
    },

    onCreate: function(e){
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
        var user = new User();
        user.set({'name': name});
        user.set({'email': email});
        user.set({'password': password});
        user.set({'tenant_id': tenant_id});
        user.set({'enabled': true});
        user.save();
        subview = new MessagesView({el: '#content', state: "Success", title: "User "+user.get('name')+" created."});
        subview.render();
    }

});