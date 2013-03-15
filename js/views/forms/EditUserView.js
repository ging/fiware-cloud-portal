var EditUserView = Backbone.View.extend({

    _template: _.itemplate($('#editUserFormTemplate').html()),

    events: {
        'submit #form': 'onUpdate',
        'input .password': 'onInput',
        'click #cancelBtn': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close',
        'click .btn-eye': 'showPassword',
        'click .btn-eye-active': 'hidePassword'
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

    onInput: function() {
        var message = '';
        var password = this.$('input[name=user_password]').val();
        var confirm = this.$('input[name=confirm_password]').val();
        if (password !== confirm) {
            message = 'Please, confirm the password.';
        }
        this.$('input[name=confirm_password]')[0].setCustomValidity(message);
    },

    showPassword: function() {
        var password = this.$('input[name=user_password]').val();
        var confirm_password = this.$('input[name=confirm_password]').val();
        $('#user_password').replaceWith('<input required id="user_password" type="text" class="password" name="user_password" maxlength="255">');
        $('#confirm_password').replaceWith('<input required id="confirm_password" type="text" class="password" name="confirm_password" maxlength="255">');
        $('#user_password').val(password);
        $('#confirm_password').val(confirm_password);
        $('.btn-eye').hide();
        $('.btn-eye-active').show();
        this.onInput();
    },

    hidePassword: function() {
        var password = this.$('input[name=user_password]').val();
        var confirm_password = this.$('input[name=confirm_password]').val();
        $('#user_password').replaceWith('<input required id="user_password" type="password" class="password" name="user_password" maxlength="255">');
        $('#confirm_password').replaceWith('<input required id="confirm_password" type="password" class="password" name="confirm_password" maxlength="255">');
        $('#user_password').val(password);
        $('#confirm_password').val(confirm_password);
        $('.btn-eye').show();
        $('.btn-eye-active').hide();
        this.onInput();
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
        subview = new MessagesView({el: '#content', state: "Success", title: "User "+this.model.get('name')+" updated."});
        subview.render();
        this.close();
    }

});