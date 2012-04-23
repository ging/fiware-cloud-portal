var RootView = Backbone.View.extend({
    
    _roottemplate: _.template($('#rootTemplate').html()),
    
    _authtemplate: _.template($('#not_logged_in').html()),
    
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
            console.log("Next view:" + this.options.next_view);

            if (this.options.next_view != undefined) {
                window.location.href = "#" + this.options.next_view;
            } else {
                window.location.href = "#syspanel";
            }
        }
    },
    
    renderAuth: function () {
        var self = this;
        console.log(self.model.get("token"));
        
        
        self.$el = $(self.options.auth_el);
        self.delegateEvents({
            'submit .credentials': 'onCredentialsSubmit',
            'click .close': 'onCloseErrorMsg'
        });
        
        if (self.model.get("token") != "" && self.model.get("error_msg") == null) return;
        
        console.log("Rendering auth");
        console.log($(self.options.root_el).css('display'));
        if ($(self.options.root_el).css('display') != 'None')
            $(self.options.root_el).fadeOut();
        $(self.options.auth_el).fadeIn();
        return this;
    },
    
    renderRoot: function () {
        var self = this;
        self.$el = $(self.options.auth_el);
        self.delegateEvents({});
        console.log("Rendering auth");
        if ($(self.options.auth_el).css('display') != 'None')
            $(self.options.auth_el).fadeOut();
        $(self.options.auth_el).fadeOut();
        $(self.options.root_el).fadeIn();
        return this;
    },
    
    renderAuthonerror: function() {
        $(this.options.auth_el).empty().html(this._authtemplate(this.model));
        $('body').attr("id", "splash");
        return this;
    }
    
});