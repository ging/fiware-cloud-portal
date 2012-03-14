var Server = Backbone.Model.extend({
    
    _action:function(method, options) {
         options.success = function(resp) {
                model.trigger('sync', model, resp, options);
            }
            var xhr = (this.sync || Backbone.sync).call(this, _method, this, options);
            return xhr;
    },
         
    reboot: function(soft, options) {
       options.soft = soft;
       return _action("reboot", options);
    },
    
    resize: function(flavor, options) {
        options.flavor = flavor;
        return _action('resize', options);
    },
    
    confirmresize: function(options) {
        return _action('confirm-resize', options);
    },
    
    revertresize: function(options) {
        return _action('revert-resize', options);
    },
    
    changepassword: function(adminPass, options) {
        options.adminPass = adminPass;
        return _action('change-password', options);
    },
    
    createimage: function(options) {
        return _action('create-image', options);        
    },
    
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.createServer(model.get("name"), model.get("imageReg"), model.get("flavorReg"), model.get("key_name"), 
                    model.get("user_data"), model.get("security_groups"), model.get("min_count"), model.get("max_count"), 
                    model.get("availability_zone"), options.success);
                break;
            case "delete":
                JSTACK.Nova.deleteServer(model.get("id"), options.success);
                break;
            case "update":
                JSTACK.Nova.updateServer(model.get("id"), model.get("name"), options.success);
                break;
            case "read":
                break;
            case "reboot":
                if (options.soft != undefined && options.soft) {
                    JSTACK.Nova.rebootserversoft(model.get("id"), options.success);
                } else {
                    JSTACK.Nova.rebootserverhard(model.get("id"), options.success);
                }
                break;
            case "resize":
                JSTACK.Nova.resizeserver(model.get("id"), options.flavor.id, options.success);
                break;
            case "confirm-resize":
                JSTACK.Nova.confirmresizedserver(model.get("id"), options.success);
                break;
            case "revert-resize":
                JSTACK.Nova.revertresizedserver(nmodel.get("id"), options.success);
                break;
            case "change-password":
                JSTACK.Nova.changepasswordserver(model.get("id"), options.adminPass, options.success);
                break;
            case "create-image":
                JSTACK.Nova.createimage(model.get("id"), options.success);
                break;

        }
    }
});

var Servers = Backbone.Collection.extend({
    
    model: Server,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getserverlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.servers;
    }
    
});

var Flavor = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getflavordetail(model.get("id"), options.success);
                   break;
           }
   }
});

var Flavors = Backbone.Collection.extend({
    model: Flavor,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getflavorlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.flavors;
    }
    
});

var Image = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success);
                   break;
           }
   }
});

var Images = Backbone.Collection.extend({
    model: Image,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getimagelist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.images;
    }
    
});

var Keypair = Backbone.Model.extend({
    
    initialize: function() {
        this.id = this.get("name");
    },
    
    sync: function(method, model, options) {
           switch(method) {
               case "create":
                   JSTACK.Nova.createkeypair(model.get("name"), model.get("public_key"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deletekeypair(model.get("name"), options.success);
                   break;
           }
   }
   
});

var Keypairs = Backbone.Collection.extend({
    model: Keypair,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getkeypairlist(options.success);
                break;
        }
    },
    
    parse: function(resp) {
        var list = [];
        for (var index in resp.keypairs) {
            var keypair = resp.keypairs[index];
            list.push(keypair.keypair);
        }
        return list;
    }
    
});

var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        error_msg: null
    },

    initialize: function () {
        this.bind('change:password', this.onCredentialsChange, this);
        this.bind('error', this.onValidateError, this);
    },
    
    validate: function (attrs) {
        console.log("Validating.... " + JSON.stringify(attrs));
        if (attrs.username == '' || attrs.password == '') {
            console.log("Null username and password");
            return "Username and password are mandatory.";
        }
    },
    
    onValidateError: function (model, error) {
        model.set({error_msg: "Username and password are mandatory."});
        model.trigger('auth-error', error.msg);
    },
    
    onCredentialsChange: function (status, apiKey) {
        var self = this;
        UTILS.Auth.authenticate(this.get("username"), this.get("password"), undefined, function() {
            self.set({'loggedIn': true});
        }, function(msg) {
            self.set({'error_msg': msg});
            self.trigger('auth-error', msg);
        });
    },
    
    setCredentials: function(username, password) {
        console.log("Setting credentials");
        this.set({'username': username, 'password': password, 'error_msg':null});
    }

});