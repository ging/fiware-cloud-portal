var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        access_token: '',
        error_msg: null,
        token: '',
        tenant: undefined,
        tenant_id: undefined,
        tenants: undefined,
        expired: true,
        current_region: undefined,
        regions: undefined
    },

    initialize: function () {

        var self = this;
        if (!UTILS.Auth.isIDM()) {
            this.bind('credentials', this.onCredentialsChange, this);
            this.bind('change:token', this.onTokenChange, this);
            this.set({'token-ts': localStorage.getItem('token-ts')});
            this.set({'tenant-id': localStorage.getItem('tenant-id')});
            this.set({'token': localStorage.getItem('token')});
            this.bind('error', this.onValidateError, this);
        } else {
            this.bind('change:access_token', this.onAccessTokenChange, this);
            this.bind('error', this.onValidateError, this);

            var regex = new RegExp("[\\#&]token=([^&#]*)");
            var token = regex.exec(location.hash);

            if (token !== null) {
                var regex1 = new RegExp("[\\&]expires=([^&#]*)");
                var expires = regex1.exec(location.hash);
                console.log('URL', token[1], expires[1]);

                if (localStorage.getItem('tenant_id')) {
                    console.log('TENANT localStorage: ', localStorage.getItem('tenant_id'));
                    self.set({tenant_id: localStorage.getItem('tenant_id')});
                }
                self.setAccessToken(token[1], expires[1]);
                

            } else {
                UTILS.Auth.goAuth();
            }
        }

        

        if (localStorage.getItem('current_region')) {
            this.set({'current_region': localStorage.getItem('current_region')});
            UTILS.Auth.switchRegion(this.get('current_region'));       
        }
    },

    onValidateError: function (model, error) {
        model.set({error_msg: "Username and password are mandatory."});
        model.trigger('auth-error', error.msg);
    },

    onCredentialsChange: function (model, password) {
        var self = this;
        if (self.get("username") !== '' && self.get("password") !== '') {
            UTILS.Auth.authenticateWithCredentials(self.get("username"), self.get("password"), undefined, undefined, function() {
                console.log("Authenticated with credentials");
                self.setToken();
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                console.log("Tenant: ", self.get('tenant').name);
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({tenants: tenants.tenants});
                    self.set({'loggedIn': true});
                });
                self.updateRegions();
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
        if (!UTILS.Auth.isAuthenticated() && token !== '' && (new Date().getTime()) < self.get('token-ts') + 24*60*60*1000 ) {
            UTILS.Auth.authenticateWithCredentials(undefined, undefined, this.get('tenant-id'), token, function() {
                console.log("Authenticated with token: ", + 24*60*60*1000-(new Date().getTime())-self.get('token-ts'));
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                console.log("New tenant: " + self.attributes.tenant.name);
                self.set({'tenant': self.attributes.tenant});
                //console.log("New tenant: " + self.get("name"));
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({tenants: tenants.tenants});
                    self.set({'loggedIn': true});
                });
                self.updateRegions();

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

    onAccessTokenChange: function (context, access_token) {
        var self = context;
        if (!UTILS.Auth.isAuthenticated() && access_token !== '' && (new Date().getTime()) < self.get('token-ts') + self.get('token-ex')) {
            console.log('Auth with ', this.get('tenant_id'), access_token);
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
                    localStorage.setItem('tenant-id', tenant.id);
                    var subview = new MessagesView({state: "Info", title: "Connected to project " + tenant.name + " (ID " + tenant.id + ")"});
                    subview.render();
                });
                self.updateRegions();
            }, function(msg) {
                console.log("Error authenticating with token");
                UTILS.Auth.logout();
            });
        } else {
            console.log("Not logged In");
            UTILS.Auth.logout();
        }
    },

    setToken: function() {
        if (localStorage.getItem('token') !== UTILS.Auth.getToken()) {
            localStorage.setItem('token-ts', new Date().getTime());
            localStorage.setItem('tenant-id', UTILS.Auth.getCurrentTenant().id);
        }
        localStorage.setItem('token', UTILS.Auth.getToken());
        this.set({'token': UTILS.Auth.getToken()});
    },

    setAccessToken: function(access_token, expires) {
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

    setCredentials: function(username, password) {
        console.log("Setting credentials");
        this.set({'username': username, 'password': password, 'error_msg':undefined});
        this.trigger('credentials', this);
    },

    switchTenant: function(tenantID) {
        var self = this;
        console.log("Tenant: " + tenantID);
        if (!UTILS.Auth.isIDM()) {
            console.log("Old tenant ", UTILS.Auth.getCurrentTenant().id);
            UTILS.Auth.switchTenant(tenantID, UTILS.Auth.getToken(), function(resp) {
                console.log("Updated to ", UTILS.Auth.getCurrentTenant().id);
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant(), tenant_id: UTILS.Auth.getCurrentTenant().id});
                localStorage.setItem('token', UTILS.Auth.getToken());
                localStorage.setItem('tenant-id', UTILS.Auth.getCurrentTenant().id);
                localStorage.setItem('tenant_id', UTILS.Auth.getCurrentTenant().id);
                self.trigger('switch-tenant');
                var subview = new MessagesView({state: "Info", title: "Connected to project " + UTILS.Auth.getCurrentTenant().name + " (ID " + UTILS.Auth.getCurrentTenant().id + ")"});
                subview.render();
            });
        } else {
            UTILS.Auth.switchTenant(tenantID, this.get('access_token'), function(tenant) {
            self.set({username: UTILS.Auth.getName(), tenant_id: tenant.id});
            localStorage.setItem('tenant_id', tenant.id);
            localStorage.setItem('tenant-id', tenant.id);
            self.trigger('switch-tenant');
            var subview = new MessagesView({state: "Info", title: "Connected to project " + tenant.name + " (ID " + tenant.id + ")"});
            subview.render();
        });
        }
    },

    switchRegion: function(regionId) {
        UTILS.Auth.switchRegion(regionId);
      
        this.set('current_region', regionId);
        localStorage.setItem('current_region', regionId);
        this.trigger('switch-region');
        var subview = new MessagesView({state: "Info", title: "Switched to region " + regionId});
        subview.render();
    },

    updateRegions: function() {

        this.set('regions', UTILS.Auth.getRegions());
        if (this.get('current_region') === undefined || this.get('regions').indexOf(this.get('current_region')) === -1) {
            this.switchRegion(this.get('regions')[0]);
        }
    },

    clearAll: function() {
        if (!UTILS.Auth.isIDM()) {
            localStorage.setItem('token', '');    
        } else {
            localStorage.removeItem('tenant_id');
            document.cookie = 'oauth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        localStorage.removeItem('current_region');
        this.set(this.defaults);
    }

});
