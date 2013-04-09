var SDC = Backbone.Model.extend({

    _action:function(method, options) {
        var model = this;
        options = options || {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    pauseserver: function(options) {
        return this._action('pause', options);
    },

    sync: function(method, model, options) {
        switch(method) {
            // case "create":
            //     UTILS.SM.createserver(model.get("name"), model.get("imageReg"), model.get("flavorReg"), model.get("key_name"),
            //        model.get("user_data"), model.get("security_groups"), model.get("min_count"), model.get("max_count"),
            //        model.get("availability_zone"), options.success, options.error);
            //     break;
            // case "delete":
            //     JSTACK.Nova.deleteserver(model.get("id"), options.success, options.error);
            //     break;
            // case "pause":
            //     JSTACK.Nova.pauseserver(model.get("id"), options.success, options.error);
            //     break;
        }
    },

    parse: function(resp) {
        if (resp.server !== undefined) {
            return resp.server;
        } else {
            return resp;
        }
    }
});

var SDCs = Backbone.Collection.extend({

    model: SDC,

    sync: function(method, model, options) {
        if(method === "read") {
            //ServiceDC.API.getProductList(options.success);
        }
    },

    parse: function(resp) {
        return resp;
    }
});