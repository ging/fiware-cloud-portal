var VolumeSnapshot = Backbone.Model.extend({
    
    _action:function(method, options) {
        var model = this;
        if (options == null) options = {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!=undefined) {
                options.callback(resp);
            }
        }
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },
    
    sync: function(method, model, options) {
        switch(method) {
            case "create": 
            console.log('Creating volume snapshot');
            	JSTACK.Nova.Volume.createsnapshot(model.get("id"), model.get("name"), model.get("description"), options.success);
                break;
            case "delete":
                JSTACK.Nova.Volume.deletesnapshot(model.get("id"), options.success);
                break;
            case "update":
                break;
            case "read":
                JSTACK.Nova.Volume.getsnapshot(model.get("id"), options.success);
                break;
        }
    },
    
    parse: function(resp) {
        if (resp.volumeSnapshot != undefined) {
            return resp.volumeSnapshot;
        } else {
            return resp;
        }
    }
});

var VolumeSnapshots = Backbone.Collection.extend({
    
    model: VolumeSnapshot,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
            console.log("Get volume snapshot list");
                JSTACK.Nova.Volume.getsnapshotlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.volumeSnapshots;
    }
    
});