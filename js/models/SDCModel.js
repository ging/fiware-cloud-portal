var SDC = Backbone.Model.extend({

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
            case "read":
                ServiceDC.API.getProductInstance(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "create":
                ServiceDC.API.installProductInstance(model.get('ip'), model.get('fqn'), model.get('product'), options.success, options.error, this.getRegion());
                break;
            case "delete":
                ServiceDC.API.uninstallProductInstance(model.get('name'), options.success, options.error, this.getRegion());
                break;
            case "update":
                var att = model.get('productRelease').product.attributes;
                ServiceDC.API.reconfigureProductInstance(model.get('name'), att, options.success, options.error, this.getRegion());
                break;

        }
    }
});

var SDCs = Backbone.Collection.extend({

    model: SDC,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    catalogueList: [],

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

    getCatalogueList: function(options) {
        options = options || {};
        return this._action('getCatalogueList', options);
    },

    getCatalogueListWithReleases: function(options) {
        var self = this;

        this.getCatalogueList({callback: function (resp) {

            self.catalogueList = [];
            var products = resp.product_asArray;

            self.getReleases(products, 0, function() {
                options.callback(self.catalogueList);
            }, function (e) {
                options.error(e);
            });

        }, error: options.error});
    },

    getCatalogueProductDetails: function(options) {
        options = options || {};
        return this._action('getCatalogueProductDetails', options);
    },

    getCatalogueProductReleases: function(options) {
        options = options || {};
        return this._action('getCatalogueProductReleases', options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                ServiceDC.API.getProductInstanceList(options.success, options.error, this.getRegion());
                break;
            case 'getCatalogueList':
                ServiceDC.API.getProductList(options.success, options.error, this.getRegion());
                break;
            case 'getCatalogueProductDetails':
                ServiceDC.API.getProductAttributes(options.id, options.success, options.error, this.getRegion());
                break;
            case 'getCatalogueProductReleases':
                ServiceDC.API.getProductReleases(options.name, options.success, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        return resp;
    },

    getReleases: function (products, index, callback, error) {

        var self = this;

         this.getCatalogueProductReleases({name: products[index].name, callback: function (resp) {

            var releases = resp.productRelease_asArray;

            for (var r in releases) {
                var pr = {};
                pr.name = products[index].name;
                pr.description = products[index].description;
                pr.attributes_asArray = products[index].attributes_asArray;
                pr.version = releases[r].version;
                pr.metadata = {};
                for (var m in products[index].metadatas_asArray) {
                    pr.metadata[products[index].metadatas_asArray[m].key] = products[index].metadatas_asArray[m].value;
                }
                self.catalogueList.push(pr);
            }

            index ++;

            if (index == products.length) {
                callback();
            } else {
                self.getReleases(products, index, callback, error);
            }

        }, error: error});
    }
});