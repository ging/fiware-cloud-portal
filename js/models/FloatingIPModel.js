var FloatingIP = Backbone.Model.extend({

    initialize: function() {
        this.id = this.get("id");
    },

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },
    
    _action:function(method, options) {
        var model = this;
        options = options || {};
        var error = options.error;
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        options.error = function(resp) {
            model.trigger('error', model, resp, options);
            if (error!==undefined) {
                error(model, resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    allocate: function(pool, options) {
      options = options || {};
      options.pool = pool;
      return this._action('allocate', options);
    },

    associate: function(server_id, fixed_address, options) {
      options = options || {};
      options.server_id = server_id;
      options.fixed_address = fixed_address;
      return this._action('associate', options);
    },

    dissasociate: function(server_id, options) {
      options = options || {};
      options.server_id = server_id;
      return this._action('dissasociate', options);
    },

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getfloatingIPdetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
               case "allocate":
                   JSTACK.Nova.allocatefloatingIP(options.pool, options.success, options.error, this.getRegion());
                   break;
               case "associate":
                   JSTACK.Nova.associatefloatingIP(options.server_id, model.get("ip"), options.fixed_address, options.success, options.error, this.getRegion());
                   break;
               case "dissasociate":
                   JSTACK.Nova.disassociatefloatingIP(options.server_id, model.get("ip"), options.success, options.error, this.getRegion());
                   break;    
               case "delete":
                   JSTACK.Nova.releasefloatingIP(model.get("id"), options.success, options.error, this.getRegion());
                   break;               
           }
    }

});

var FloatingIPs = Backbone.Collection.extend({
    model: FloatingIP,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getfloatingIPs(options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        var list = [];
        for (var index in resp.floating_ips) {
            var floating_ip = resp.floating_ips[index];
            list.push(floating_ip);
        }
        return list;
    }

});