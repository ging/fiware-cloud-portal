var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        access_token: '',
        tenant_id: undefined,
        tenants: undefined,
        expired: true
    },

    initialize: function () {

        var self = this;
        //this.bind('credentials', this.onCredentialsChange, this);
        this.bind('change:access_token', this.onTokenChange, this);
        this.bind('error', this.onValidateError, this);

        var regex = new RegExp("[\\#&]token=([^&#]*)");
        var token = regex.exec(location.hash);

        if (token !== null) {
            var regex1 = new RegExp("[\\&]expires=([^&#]*)");
            var expires = regex1.exec(location.hash);
            console.log('en URL', token[1], expires[1]);

            if (localStorage.getItem('tenant_id')) {
                console.log('TENANT en localStorage: ', localStorage.getItem('tenant_id'));
                self.set({tenant_id: localStorage.getItem('tenant_id')});
            }
            self.setToken(token[1], expires[1]);
            

        } else {
            UTILS.Auth.goAuth();
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
        console.log('veamos ', (new Date().getTime()), self.get('token-ts'), self.get('token-ex'));
        if (!UTILS.Auth.isAuthenticated() && access_token !== '' && (new Date().getTime()) < self.get('token-ts') + self.get('token-ex')) {
            console.log('autentico con ', this.get('tenant_id'), access_token);
            UTILS.Auth.authenticate(this.get('tenant_id'), access_token, function(tenant) {
                console.log("Authenticated with token: ", + self.get('token-ex') - (new Date().getTime())-self.get('token-ts'));
                //console.log("New tenant: " + self.attributes.tenant.name);
                //self.set({'tenant': self.attributes.tenant});
                //console.log("New tenant: " + self.get("name"));
                self.set({username: UTILS.Auth.getName()});
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({tenant_id: tenant.id});
                    self.set({tenants: tenants.tenants});
                    self.set({'loggedIn': true});
                    localStorage.setItem('tenant_id', tenant.id);
                    var subview = new MessagesView({state: "Info", title: "Connected to project " + tenant.name + " (ID " + tenant.id + ")"});
                    subview.render();
                });
            }, function(msg) {
                console.log("Error authenticating with token");
                UTILS.Auth.logout();
            });
        } else {
            console.log("Not logged In");
            UTILS.Auth.logout();
        }
    },

    setToken: function(access_token, expires) {
        console.log('setToken', access_token, expires*1000);
        this.set({'token-ts': new Date().getTime()});
        this.set({'token-ex': expires*1000});
        this.set({'access_token': access_token});

    },

    isAdmin: function() {
        return UTILS.Auth.isAdmin();
    },

    removeToken: function() {
        this.set({'access_token': ''});
    },

    // setCredentials: function(username, password) {
    //     console.log("Setting credentials");
    //     this.set({'username': username, 'password': password, 'error_msg':undefined});
    //     this.trigger('credentials', this);
    // },

    switchTenant: function(tenantID) {
        var self = this;
        console.log("Tenant: " + tenantID);
        UTILS.Auth.switchTenant(tenantID, this.get('access_token'), function(tenant) {
            self.set({username: UTILS.Auth.getName(), tenant_id: tenant.id});
            localStorage.setItem('tenant_id', tenant.id);
            self.trigger('switch-tenant');
            var subview = new MessagesView({state: "Info", title: "Connected to project " + tenant.name + " (ID " + tenant.id + ")"});
            subview.render();
        });
    },

    clearAll: function() {
        localStorage.removeItem('tenant_id');
        document.cookie = 'oauth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.set(this.defaults);
    }

});