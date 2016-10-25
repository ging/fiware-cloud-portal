var BPInstance = Backbone.Model.extend({

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

    addVMToTier: function(options) {
        this._action("addVM", options);
    },

    removeVMFromTier: function(options) {
        this._action("removeVM", options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "addVM":
                JSTACK.Murano.addVMToTier(model.get('blueprintName'), options.tier, options.success, options.error, this.getRegion());
                break;
            case "removeVM":
                JSTACK.Murano.removeVMFromTier(model.get('blueprintName'), options.instance_name, options.success, options.error, this.getRegion());
                break;
            case "read":
                JSTACK.Murano.getBlueprintInstance(model.get('blueprintName'), options.success, options.error, this.getRegion());
                break;
            case "create":
                JSTACK.Murano.launchBlueprintInstance(model.get('environmentDto').id, model.get('blueprintName'), options.success, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Murano.stopBlueprintInstance(model.id, options.success, options.error, this.getRegion());
                break;
            case "update":

                break;

        }
    },

    parse: function(resp) {
        // if (resp) {
        //     resp.id = resp.blueprintName;
        //     resp.name = resp.environmentInstanceName;
        // }
        return resp;
    }
});

var BPInstances = Backbone.Collection.extend({

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

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
                JSTACK.Murano.getBlueprintInstanceList(function (instances) {
                     var owned_instances = [];
                    for (var t in instances) {
                            instances[t].description = instances[t].description_text;
                        if (UTILS.Auth.getCurrentTenant().id === instances[t].tenant_id) {
                            owned_instances.push(instances[t]);
                        }
                    }
                    options.success(owned_instances);
                }, options.error, this.getRegion());
                break;
            case 'getTask':
                //JSTACK.Murano.getTask(options.taskId, function (resp) {
                    var message = 'Blueprint Instance ' + model.models[0].get('name') + ' status.';
                    message += '<br><br>Status: ' + model.models[0].get('status');
                    // if (resp.error) {
                    //     message += '<br><br>Error: ' + resp.error._message;
                    // }
                    options.success(message);

                //}, options.error, this.getRegion());
                break;
            case 'getCatalogueProductDetails':
                // ServiceDC.API.getProductAttributes(options.id, options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        return resp;
    }
});
