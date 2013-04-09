var CreateUserView = Backbone.View.extend({

    _template: _.itemplate($('#createUserFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'input .password': 'onInput',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close',
        'click .btn-eye': 'showPassword',
        'click .btn-eye-active': 'hidePassword'
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
        console.log("on input");
        console.log(this.$('input[name=user_password]').val());
        console.log(this.$('input[name=confirm_password]').val());
        var message = '';
        var password = this.$('input[name=user_password]').val();
        var confirm = this.$('input[name=confirm_password]').val();
        if (password !== confirm) {
            message = 'Please, confirm the password.';
        }
        console.log(message);
        this.$('input[name=confirm_password]')[0].setCustomValidity(message);
    },

    showPassword: function() {
        console.log($('.user_password').val());
        var password = this.$('input[name=user_password]').val();
        var confirm_password = this.$('input[name=confirm_password]').val();
        console.log("confirm_pass = "+this.$('input[name=confirm_password]').val());
        $('#user_password').replaceWith('<input required id="user_password" type="text" class="password" name="user_password" maxlength="255">');
        $('#confirm_password').replaceWith('<input required id="confirm_password" type="text" class="password" name="confirm_password" maxlength="255">');
        $('#user_password').val(password);
        $('#confirm_password').val(confirm_password);
        $('.btn-eye').hide();
        $('.btn-eye-active').show();
        this.onInput();
    },

    hidePassword: function() {
        console.log($('.show_password').val());
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
        subview = new MessagesView({state: "Success", title: "User "+user.get('name')+" created."});
        subview.render();
        this.close();
    }

});