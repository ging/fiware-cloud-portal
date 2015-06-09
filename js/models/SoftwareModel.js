var Software = Backbone.Model.extend({

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

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                ServiceDC.API.getProductInstance(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "create":
                ServiceDC.API.installProductInstance(model.get('ip'), model.get('fqn'), model.get('product'), model.get('hostname'), options.success, options.error, this.getRegion());
                break;
            case "delete":
                ServiceDC.API.uninstallProductInstance(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "update":
                var att = model.get('productRelease').product.attributes;
                ServiceDC.API.reconfigureProductInstance(model.get('name'), att, options.success, options.error, this.getRegion());
                break;

        }
    }
});

var Softwares = Backbone.Collection.extend({

    model: Software,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    _action: function(method, options) {
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

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                ServiceDC.API.getProductInstanceList(options.success, options.error, this.getRegion());
                break;
            case "create":
                break;
        }
    },

    parse: function(resp) {
        return resp;
    }
});