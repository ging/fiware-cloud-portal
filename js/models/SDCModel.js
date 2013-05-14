var SDC = Backbone.Model.extend({

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
                ServiceDC.API.getProductInstance(model.get('name'), options.success, options.error);
                break;
            case "create":
                ServiceDC.API.getProductReleases(model.get('product').name, function (resp) {
                    var lastRelease = resp.productRelease_asArray[0].version;
                    var p = model.get('product');
                    p.version = lastRelease;
                    model.set({'product': p});
                    model.set({"name": model.get('fqn') + '_' + p.name + '_' + p.version});
                    ServiceDC.API.installProductInstance(model.get('ip'), model.get('fqn'), model.get('product'), options.success, options.error);
                }, options.error);
                break;
            case "delete":
                ServiceDC.API.uninstallProductInstance(model.get('name'), options.success, options.error);
                break;
            case "update":
                var att = model.get('productRelease').product.attributes;
                ServiceDC.API.reconfigureProductInstance(model.get('name'), att, options.success, options.error);
                break;

        }
    }
});

var SDCs = Backbone.Collection.extend({

    model: SDC,

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

    getCatalogueProductDetails: function(options) {
        options = options || {};
        return this._action('getCatalogueProductDetails', options);
    },

    fetchCollection: function(options) {

        var self = this;

        ServiceDC.API.getProductList(function (resp) {
            ServiceDC.API.getProductInstanceList(function (resp2) {
                self.catalogueList = resp.product;
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
                ServiceDC.API.getProductAttributes(options.id, options.success, options.error);
                break;
        }
    },

    parse: function(resp) {
        return resp;
    }
});