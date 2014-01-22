var VolumeSnapshot = Backbone.Model.extend({

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
                JSTACK.Cinder.createsnapshot(model.get("volume_id"), model.get("name"), model.get("description"), options.success, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Cinder.deletesnapshot(model.get("id"), options.success, options.error, this.getRegion());
                break;
            case "update":
                break;
            case "read":
                JSTACK.Cinder.getsnapshot(model.get("id"), options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        if (resp.snapshot !== undefined) {
            return resp.snapshot;
        } else {
            return resp;
        }
    }
});

var VolumeSnapshots = Backbone.Collection.extend({

    model: VolumeSnapshot,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if(method === "read") {
            JSTACK.Cinder.getsnapshotlist(true, options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.snapshots;
    }

});