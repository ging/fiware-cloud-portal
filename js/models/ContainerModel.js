var Container = Backbone.Model.extend({

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

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    copyObject: function(currentObject, targetContainer, targetObject, options) {
        console.log("Copy object");
        options = options || {};
        options.currentObject = currentObject;
        options.targetContainer = targetContainer;
        options.targetObject = targetObject;
        return this._action('copyObject', options);
    },

    uploadObject: function(objectName, object, options) {
        console.log("Upload object");
        options = options || {};
        options.objectName = objectName;
        options.object = object;
        return this._action('uploadObject', options);
    },

    downloadObject: function(objectName, options) {
        options = options || {};
        options.objectName = objectName;
        return this._action('downloadObject', options);
    },

    deleteObject: function(objectName, options) {
        console.log("Delete objects");
        options = options || {};
        options.objectName = objectName;
        return this._action('deleteObject', options);
    },

    sync: function(method, model, options) {
        switch (method) {
            case "read":
                mySucess = function(objects) {
                    var cont = {};
                    cont.objects = objects;
                    return options.success(cont);
                };
                JSTACK.Swift.getobjectlist(model.get('name'), mySucess, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Swift.deletecontainer(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "create":
                JSTACK.Swift.createcontainer(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "copyObject":
                JSTACK.Swift.copyobject(model.get('name'), options.currentObject, options.targetContainer, options.targetObject, options.success, options.error, this.getRegion());
                break;
            case "uploadObject":
                var reader = new FileReader();
                var self = this;
                reader.onload = function(event) {
                    var data = event.target.result.toString();
                    var data_index = data.indexOf('base64') + 7;
                    var data_index2 = data.indexOf('data:') + 5;
                    var filedata = data.slice(data_index, data.length);
                    var filetype = data.slice(data_index2, data_index-8);
                  JSTACK.Swift.uploadobject(model.get('name'), options.objectName, filedata, filetype, options.success, options.error, self.getRegion());
                };
                reader.readAsDataURL(options.object);
                break;
            case "downloadObject":
                JSTACK.Swift.downloadobject(model.get('name'), options.objectName, options.success, options.error, this.getRegion());
                break;
            case "deleteObject":
                JSTACK.Swift.deleteobject(model.get('name'), options.objectName, options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        if (resp !== undefined && resp.container !== undefined) {
            resp.container.id = resp.container.name;
            return resp.container;
        } else if (resp !== undefined) {
            resp.id = resp.name;
            return resp;
        } else {
            return {};
        }
    }
});

var Containers = Backbone.Collection.extend({
    model: Container,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Swift.getcontainerlist(options.success, options.error, this.getRegion());
        }
    },

    comparator: function(container) {
        return container.get("id");
    },

    parse: function(resp) {
        return resp;
    }

});