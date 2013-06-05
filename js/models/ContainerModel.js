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
                CDMI.Actions.getobjectlist(model.get('name'), mySucess);
                break;
            case "delete":
                CDMI.Actions.deletecontainer(model.get('name'), options.success, options.error);
                console.log(options.success, options.error);
                break;
            case "create":
                CDMI.Actions.createcontainer(model.get('name'), options.success, options.error);
                break;
            case "copyObject":
                CDMI.Actions.copyobject(model.get('name'), options.currentObject, options.targetContainer, options.targetObject, options.success, options.error);
                break;
            case "uploadObject":
                CDMI.Actions.uploadobject(model.get('name'), options.objectName, options.object, options.success, options.error);
                break;
            case "downloadObject":
                console.log("Download object, ", options.success, options.error);
                CDMI.Actions.downloadobject(model.get('name'), options.objectName, options.success, options.error);
                break;
            case "deleteObject":
                CDMI.Actions.deleteobject(model.get('name'), options.objectName, options.success, options.error);
                break;
        }
    },

    parse: function(resp) {
        if (resp.container !== undefined) {
            resp.container.id = resp.container.name;
            return resp.container;
        } else {
            resp.id = resp.name;
            return resp;
        }
    }
});

var Containers = Backbone.Collection.extend({
    model: Container,

    sync: function(method, model, options) {
        if (method === "read") {
            CDMI.Actions.getcontainerlist(options.success, options.error);
        }
    },

    comparator: function(container) {
        return container.get("id");
    },

    parse: function(resp) {
        return resp;
    }

});