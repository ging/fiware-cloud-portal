var Volume = Backbone.Model.extend({

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
            case "create":
                JSTACK.Cinder.createvolume(model.get("size"), model.get("name"), model.get("description"), options.success, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Cinder.deletevolume(model.get("id"), options.success, options.error, this.getRegion());
                break;
            case "update":
                break;
            case "read":
                JSTACK.Cinder.getvolume(model.get("id"), options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        if (resp.volume !== undefined) {
            return resp.volume;
        } else {
            return resp;
        }
    }
});

var Volumes = Backbone.Collection.extend({

    model: Volume,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method == 'read') {
            JSTACK.Cinder.getvolumelist(true, options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.volumes;
    }

});