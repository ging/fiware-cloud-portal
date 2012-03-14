var AppView = Backbone.View.extend({

    _loggedInTemplate: _.template($('#logged_in').html()),

    _notLoggedInTemplate: _.template($('#not_logged_in').html()),
    

    initialize: function () {
        this.model.bind('change:loggedIn', this.render, this);
        this.model.bind('auth-error', this.render, this);
    },

    events: {
        'submit .credentials': 'onCredentialsSubmit'
    },
    
    onCredentialsSubmit: function(e){
        e.preventDefault();
        this.model.setCredentials(this.$('input[name=username]').val(), this.$('input[name=password]').val());
    },
    
    render: function () {
        if (this.model.get('loggedIn')) {
            var self = this;
            $(this.el).fadeOut('slow', function() {
               $(self.el).empty().html(self._loggedInTemplate(self.model));
               $(self.el).fadeIn('slow');
            });
            
            
        } else {
            $(this.el).empty().html(this._notLoggedInTemplate(this.model));
        }
        return this;
    }
});