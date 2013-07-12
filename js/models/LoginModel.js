var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        token: '',
        access_token: '',
        tenant: undefined,
        tenants: undefined
    },

    initialize: function () {

        var self = this;
        //this.bind('credentials', this.onCredentialsChange, this);
        this.bind('change:access_token', this.onTokenChange, this);
        this.bind('error', this.onValidateError, this);

        var regex = new RegExp("[\\?&]token=([^&#]*)");
        var token = regex.exec(location.search);

        if (token !== null) {
            var regex1 = new RegExp("[\\?&]expires=([^&#]*)");
            var expires = regex.exec(location.search);
            console.log('en URL', token[1], expires[1]);
           
            UTILS.Auth.getTenants(function(tenants) {
                self.set({tenants: tenants});
                self.setToken(token[1], expires[1]);
            });

        };

        console.log('en localStorage ', localStorage.getItem('access_token'));

        this.set({'token-ts': localStorage.getItem('token-ts')});
        this.set({'token-ex': localStorage.getItem('token-ex')});
        this.set({'tenant-id': localStorage.getItem('tenant-id')});
        this.set({'access_token': localStorage.getItem('access_token')});

        if (localStorage.getItem('access_token') == null) {
            this.set({'access_token': ''});
        }
    },

    // onValidateError: function (model, error) {
    //     model.set({error_msg: "Username and password are mandatory."});
    //     model.trigger('auth-error', error.msg);
    // },

    // onCredentialsChange: function (model, password) {
    //     var self = this;
    //     if (self.get("username") !== '' && self.get("password") !== '') {
    //         UTILS.Auth.authenticate(self.get("username"), self.get("password"), undefined, undefined, function() {
    //             console.log("Authenticated with credentials");
    //             self.setToken();
    //             self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
    //             console.log("Tenant: ", self.get('tenant').name);
    //             UTILS.Auth.getTenants(function(tenants) {
    //                 self.set({tenants: tenants});
    //                 self.set({'loggedIn': true});
    //             });
    //         }, function(msg) {
    //             self.set({'error_msg': msg});
    //             self.trigger('auth-error', msg);
    //         });
    //     } else {
    //         var msg = "Username and password are mandatory.";
    //         self.set({'error_msg': msg});
    //         self.trigger('auth-error', msg);
    //     }
    // },

    onTokenChange: function (context, access_token) {
        var self = context;
        console.log('veamos ', UTILS.Auth.isAuthenticated(), access_token, (new Date().getTime()), self.get('token-ts'), self.get('token-ex'));
        if (!UTILS.Auth.isAuthenticated() && access_token !== '' && (new Date().getTime()) < self.get('token-ts') + self.get('token-ex')*1000 ) {
            UTILS.Auth.authenticate(this.get('tenant-id'), access_token, function() {
                console.log("Authenticated with token: ", + self.get('token-ex')*1000-(new Date().getTime())-self.get('token-ts'));
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                console.log("New tenant: " + self.attributes.tenant.name);
                self.set({'tenant': self.attributes.tenant});
                //console.log("New tenant: " + self.get("name"));
                self.set({'loggedIn': true});
            }, function(msg) {
                console.log("Error authenticating with token");
                self.set({'expired': true});
                self.trigger('auth-needed', "");
                self.set({'loggedIn': false});
                self.trigger('auth-error', "");
            });
        } else {
            console.log("Not logged In");
            self.set({'expired': true});
            self.trigger('auth-needed', "");
            self.set({'loggedIn': false});
        }
    },

    setToken: function(access_token, expires) {
        if (localStorage.getItem('access_token') !== access_token) {
            localStorage.setItem('token-ts', new Date().getTime());
            localStorage.setItem('tenant-id', UTILS.Auth.getCurrentTenant().id);
        }
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token-ex', expires);
        localStorage.setItem('token', UTILS.Auth.getToken());
        this.set({'token': UTILS.Auth.getToken()});
        this.set({'access_token': access_token});
        this.set({'token-ex': expires});
    },

    isAdmin: function() {
        return UTILS.Auth.isAdmin();
    },

    removeToken: function() {
        localStorage.setItem('access_token', '');
        localStorage.setItem('token', '');
        this.set({'access_token': ''});
        this.set({'token': ''});
    },

    // setCredentials: function(username, password) {
    //     console.log("Setting credentials");
    //     this.set({'username': username, 'password': password, 'error_msg':undefined});
    //     this.trigger('credentials', this);
    // },

    switchTenant: function(tenantID) {
        var self = this;
        console.log("Tenant: " + tenantID);
        UTILS.Auth.switchTenant(tenantID, function(resp) {
            self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
            localStorage.setItem('token', UTILS.Auth.getToken());
            localStorage.setItem('tenant-id', UTILS.Auth.getCurrentTenant().id);
            self.trigger('switch-tenant');
        });
    },

    clearAll: function() {
        localStorage.setItem('token', '');
        localStorage.setItem('access_token', '');
        this.set(this.defaults);
    }

});