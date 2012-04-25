var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        error_msg: null,
        token: '',
        tenant: undefined,
        tenants: undefined
    },

    initialize: function () {
        this.bind('credentials', this.onCredentialsChange, this);
        this.bind('change:token', this.onTokenChange, this);
        this.bind('error', this.onValidateError, this);
        this.set({'token': localStorage.getItem('token')});
    },
    
    onValidateError: function (model, error) {
        model.set({error_msg: "Username and password are mandatory."});
        model.trigger('auth-error', error.msg);
    },
    
    onCredentialsChange: function (model, password) {
        var self = this;
        if (self.get("username") != '' && self.get("password") != '') {
            UTILS.Auth.authenticate(self.get("username"), self.get("password"), undefined, undefined, function() {
                console.log("Authenticated with credentials");
                self.setToken();
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({tenants: tenants});
                    self.set({'loggedIn': true});
                });
            }, function(msg) {
                self.set({'error_msg': msg});
                self.trigger('auth-error', msg);
            });
        } else {
            var msg = "Username and password are mandatory.";
            self.set({'error_msg': msg});
            self.trigger('auth-error', msg);
        }
    },
    
    onTokenChange: function (context, token) {
        var self = context;
        console.log(self);
        if (!UTILS.Auth.isAuthenticated() && token != '') {
            UTILS.Auth.authenticate(undefined, undefined, undefined, token, function() {
                console.log("Authenticated with token");
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                console.log("New tenant: " + self.get("name"));
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({tenants: tenants});
                    self.set({'loggedIn': true});
                });
                
            }, function(msg) {
                console.log("Error authenticating with token");
                self.set({'error_msg': msg});
                self.trigger('auth-error', msg);
            });
        } else {
            self.set({'loggedIn': false});
        }
    },
    
    setToken: function() {
        localStorage.setItem('token', UTILS.Auth.getToken());
        this.set({'token': UTILS.Auth.getToken()});
    },
    
    isAdmin: function() {
        return UTILS.Auth.isAdmin();  
    },
    
    removeToken: function() {
        localStorage.setItem('token', '');
        this.set({'token': ''});
    },
    
    setCredentials: function(username, password) {
        console.log("Setting credentials");
        this.set({'username': username, 'password': password, 'error_msg':undefined});
        this.trigger('credentials', this);
    },
    
    switchTenant: function(tenantID) {
        var self = this;
        console.log("Tenant: " + tenantID);
        UTILS.Auth.switchTenant(tenantID, function(resp) {
            console.log(resp);
            self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
            self.trigger('switch-tenant');
        });
    },
    
    clearAll: function() {
        localStorage.setItem('token', '');
        this.set(this.defaults);
    }

});