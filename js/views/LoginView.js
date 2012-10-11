var LoginView = Backbone.View.extend({

    _template: _.itemplate($('#not_logged_in').html()),
    
    initialize: function () {
    console.log("Init Login view");
        this.model.bind('change:loggedIn', this.onLogin, this);
        this.model.bind('auth-error', this.renderonerror, this);
        this.model.bind('auth-needed', this.render, this);
        this.onLogin();
    },

    events: {
        'click #home_loginbtn': 'onCredentialsSubmit',
        'click .close': 'onCloseErrorMsg'
    },
    
    onCredentialsSubmit: function(e){
        e.preventDefault();
        this.model.setCredentials(this.$('input[name=username]').val(), this.$('input[name=password]').val());
    },
    
    onCloseErrorMsg: function(e) {
        this.model.set({"error_msg": null});
        this.renderonerror();
    },
    
    onLogin: function() {
        console.log("Checking");
        if (this.model.get('loggedIn')) {
            if (this.options.next_view != undefined) {
                window.location.href = "#" + this.options.next_view;
            } else {
                window.location.href = "#syspanel";
            }
        }
    },
    
    render: function () {
        console.log("Rendering login");
        var self = this;
        $(this.el).fadeOut('slow', function() {
            $('#root').css('display', 'none');
            $(self.el).empty().html(self._template(self.model));
            $(self.el).fadeIn('slow');
        });
        return this;
    },
    
    renderonerror: function() {
        $('#root').css('display','none');
        $(this.el).empty().html(this._template(this.model));
        return this;
    }
});