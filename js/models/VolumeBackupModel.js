var VolumeBackup = Backbone.Model.extend({

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
                JSTACK.Cinder.createbackup(model.get("volume_id"), model.get("name"), model.get("description"), options.success, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Cinder.deletebackup(model.get("id"), options.success, options.error, this.getRegion());
                break;
            case "update":
                break;
            case "read":
                JSTACK.Cinder.getbackup(model.get("id"), options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        if (resp.backup !== undefined) {
            return resp.backup;
        } else {
            return resp;
        }
    }
});

var VolumeBackups = Backbone.Collection.extend({

    model: VolumeBackup,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        console.log('eieieiieiei');
        if(method === "read") {
            JSTACK.Cinder.getbackuplist(options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.backups;
    }

});