var CreateUserView = Backbone.View.extend({

    _template: _.itemplate($('#createUserFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'input .password': 'onInput',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close',
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

    onInput: function() {
        var message = '';
        var password = this.$('input[name=user_password]').val();
        var confirm = this.$('input[name=confirm_password]').val();
        if (password !== confirm) {
            message = 'Please, confirm the password.';
        }
        console.log(message);
        this.$('input[name=confirm_password]')[0].setCustomValidity(message);
    },

    onCreate: function(e){
        e.preventDefault();
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
        this.close();
    }

});