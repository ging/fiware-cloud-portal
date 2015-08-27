var BPInstance = Backbone.Model.extend({

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

    addVMToTier: function(options) {
        this._action("addVM", options);
    },

    removeVMFromTier: function(options) {
        this._action("removeVM", options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "addVM":
                BP.API.addVMToTier(model.get('blueprintName'), options.tier, options.success, options.error);
                break;
            case "removeVM":
                BP.API.removeVMFromTier(model.get('blueprintName'), options.instance_name, options.success, options.error);
                break;
            case "read":
                BP.API.getBlueprintInstance(model.get('blueprintName'), options.success, options.error);
                break;
            case "create":
                BP.API.launchBlueprintInstance(model.toJSON(), options.success, options.error);
                break;
            case "delete":
                BP.API.stopBlueprintInstance(model.get('blueprintName'), options.success, options.error);
                break;
            case "update":

                break;

        }
    },

    parse: function(resp) {
        if (resp) {
            console.log('voooooooooooo ', resp);
            resp.id = resp.blueprintName;
            resp.name = resp.environmentInstanceName;
        }
        return resp;
    }
});

var BPInstances = Backbone.Collection.extend({

    model: BPInstance,

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

    // getCatalogueProductDetails: function(options) {
    //     options = options || {};
    //     return this._action('getCatalogueProductDetails', options);
    // },

    getTask: function(options) {
        options = options || {};
        return this._action('getTask', options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                BP.API.getBlueprintInstanceList(options.success, options.error);
                break;
            case 'getTask':
                BP.API.getTask(options.taskId, function (resp) {
                    var message = 'Blueprint Instance ' + resp.environment + ' status.';
                    message += '<br><br>Description: ' + resp.description;
                    message += '<br><br>Status: ' + resp._status;
                    if (resp.error) {
                        message += '<br><br>Error: ' + resp.error._message;
                    }
                    options.success(message);

                }, options.error);
                break;
            case 'getCatalogueProductDetails':
                // ServiceDC.API.getProductAttributes(options.id, options.success, options.error);
                break;
        }
    },

    parse: function(resp) {
        return resp;
    }
});
