var RootView = Backbone.View.extend({

    _roottemplate: _.itemplate($('#rootTemplate').html()),

    _authtemplate: _.itemplate($('#not_logged_in').html()),

    consoleMaximizes: false,

    events: {
        "click #message-resize-icon": "toggleMaxConsole"
    },

    initialize: function () {
        $(this.options.auth_el).empty().html(this._authtemplate(this.model)).css('display', 'None');
        $(this.options.root_el).empty().html(this._roottemplate()).css('display', 'None');
        this.model.bind('change:loggedIn', this.onLogin, this);
        this.model.bind('auth-error', this.renderAuthonerror, this);
        $("#message-resize-icon").live("click", this.toggleMaxConsole);
        this.onLogin();
    },

    toggleMaxConsole: function() {
        console.log("Maximizing");
        $('#message-resize-icon').removeClass('icon-resize-full');
        $('#message-resize-icon').removeClass('icon-resize-small');
        if (this.consoleMaximizes) {
            $('#log-messages').css('overflow', 'hidden');
            $('#logs').animate({height: '48px'}, 500);
            $('#log-messages').animate({height: '48px'}, 500);
            $('#message-resize-icon').addClass('icon-resize-full');
        } else {
            $('#log-messages').css('overflow', 'auto');
            $('#message-resize-icon').addClass('icon-resize-small');
            $('#logs').animate({height: '348px'}, 500);
            $('#log-messages').animate({height: '348px'}, 500);
        }
        $('#log-messages').animate({scrollTop: ($('.messages').length-1)*(48)+'px'}, 500);
        this.consoleMaximizes = !this.consoleMaximizes;
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
        console.log(self.model.get("token"), self.model.get("tenant"), self.model.get("error_msg"), self.model.get("expired"));
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