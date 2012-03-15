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