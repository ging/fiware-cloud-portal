var RootView = Backbone.View.extend({
    
    _roottemplate: _.itemplate($('#rootTemplate').html()),
    
    _authtemplate: _.itemplate($('#not_logged_in').html()),
    
    initialize: function () {
        $(this.options.auth_el).empty().html(this._authtemplate(this.model)).css('display', 'None');
        $(this.options.root_el).empty().html(this._roottemplate()).css('display', 'None');
        this.model.bind('change:loggedIn', this.onLogin, this);
        this.model.bind('auth-error', this.renderAuthonerror, this);
        this.onLogin();
    },
    
    onCredentialsSubmit: function(e){
        e.preventDefault();
        this.model.setCredentials(this.$('input[name=username]').val(), this.$('input[name=password]').val());
    },
    
    onCloseErrorMsg: function(e) {
        this.model.set({"error_msg": null});
        this.renderAuthonerror();
    },
    
    onLogin: function() {
        if (this.model.get('loggedIn')) {
            if (this.options.next_view !== undefined) {
                window.location.href = "#" + this.options.next_view;
            } else {
                window.location.href = "#syspanel";
            }
        }
    },
    
    renderAuth: function () {
        var self = this;
        self.$el = $(self.options.auth_el);
        self.delegateEvents({
            'click #home_loginbtn': 'onCredentialsSubmit',
            'click .close': 'onCloseErrorMsg'
        });
        console.log(self.model.get("token"), self.model.get("error_msg"), self.model.get("expired"));
        if ((self.model.get("token") !== "" && self.model.get("error_msg") == null) && self.model.get("expired") !== true) return;
       console.log("Conditions passed");
        if ($(self.options.root_el).css('display') !== 'None')
            $(self.options.root_el).fadeOut();
        $(self.options.auth_el).fadeIn();
        return this;
    },
    
    renderRoot: function () {
        var self = this;
        self.$el = $(self.options.auth_el);
        self.delegateEvents({});
        if ($(self.options.auth_el).css('display') !== 'None')
            $(self.options.auth_el).fadeOut();
        $(self.options.auth_el).fadeOut();
        $(self.options.root_el).fadeIn();
        return this;
    },
    
    renderAuthonerror: function() {
        if ($(this.options.auth_el).css('display') == 'none') 
            $(this.options.auth_el).fadeIn();
        $(this.options.auth_el).empty().html(this._authtemplate(this.model));
        $('body').attr("id", "splash");
        return this;
    }
    
});