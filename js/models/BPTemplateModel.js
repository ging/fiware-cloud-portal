var BPTemplate = Backbone.Model.extend({

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
                BP.API.getBlueprintTemplate(model.get('name'), options.success, options.error);
                break;
            case "create":
                BP.API.createBlueprintTempate(model, options.success, options.error);
                break;
            case "delete":
                BP.API.deleteBlueprintTemplate(model.get('name'), options.success, options.error);
                break;
            case "update":
           
                break;
            
        }
    }
});

var BPTemplates = Backbone.Collection.extend({

    model: BPTemplate,

    catalogueList: {},

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

    fetchCollection: function(options) {

        var self = this;

        BP.API.getBlueprintList(function (resp) {
            BP.API.getBlueprintTemplateList(function (resp2) {
                self.catalogueList = resp;
                options.success(resp2);
            }, options.error);

        }, options.error);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                this.fetchCollection(options);
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