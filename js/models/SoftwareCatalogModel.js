// var SoftwareCatalog = Backbone.Model.extend({

//     region: undefined,

//     getRegion: function() {
//         if (this.region) {
//             return this.region;
//         }
//         return UTILS.Auth.getCurrentRegion();
//     },

//     _action:function(method, options) {
//         var model = this;
//         options = options || {};
//         var error = options.error;
//         options.success = function(resp) {
//             model.trigger('sync', model, resp, options);
//             if (options.callback!==undefined) {
//                 options.callback(resp);
//             }
//         };
//         options.error = function(resp) {
//             model.trigger('error', model, resp, options);
//             if (error!==undefined) {
//                 error(model, resp);
//             }
//         };
//         var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
//         return xhr;
//     },

//     sync: function(method, model, options) {
//         switch(method) {
//             case "read":
// 					// Using SDC we already have all the needed info. This is thougth for murano
// 					options.success();
//                 break;
//             case "create":
//                 ServiceDC.API.addRecipe(model.get('name'), model.get('version'), 
//                     model.get('repo'), model.get('url'), model.get('config_management'), 
//                     model.get('operating_systems'), model.get('description'), model.get('attributes'), 
//                     model.get('tcp_ports'), model.get('udp_ports'), model.get('dependencies'), 
//                     options.success, options.error, this.getRegion());
//                 break;
//             case "delete":
                
//                 break;
//             case "update":
                
//                 break;

//         }
//     }
// });

// var SoftwareCatalogs = Backbone.Collection.extend({

//     model: SoftwareCatalog,

//     region: undefined,

//     getRegion: function() {
//         if (this.region) {
//             return this.region;
//         }
//         return UTILS.Auth.getCurrentRegion();
//     },

//     _action: function(method, options) {
//         var model = this;
//         options = options || {};
//         options.success = function(resp) {
//             model.trigger('sync', model, resp, options);
//             if (options.callback!==undefined) {
//                 options.callback(resp);
//             }
//         };
//         var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
//         return xhr;
//     },

//     // getCatalogueListWithReleases: function(options) {
//     //     var self = this;

//     //     self.releasesList = [];

//     //     ServiceDC.API.getProductList(function (resp) {

//     //         var products = resp.product_asArray;
//     //         self.getReleases(products, 0, options.success, options.error);

//     //     }, options.error, this.getRegion());
//     // },

//     getCatalogueListWithReleases: function(options) {
//         var self = this;

//         self.releasesList = [];

//         ServiceDC.API.getProductAndReleaseList(function (resp) {

//             var list = [];

//             for (var p in resp) {
//                 resp[p].product.version = resp[p].version;

//                 var meta = {};
                
//                 for (var m in resp[p].product.metadatas_asArray) {
//                     meta[resp[p].product.metadatas_asArray[m].key] = resp[p].product.metadatas_asArray[m].value;
//                 }

//                 delete resp[p].product.metadatas_asArray;
//                 delete resp[p].product.metadatas;

//                 resp[p].product.metadatas = meta;

//                 list.push(resp[p].product);

//             }

//             options.success(list);

//         }, options.error, this.getRegion());
//     },

//     sync: function(method, model, options) {
//         switch(method) {
//             case 'read':
//                 this.getCatalogueListWithReleases(options);
//                 break;
//             case 'create':
//                 break;
//         }
//     },

//     parse: function(resp) {
//         return resp;
//     },

//     releasesList: [],

//     getReleases: function (products, index, callback, error) {

//         var self = this;

//         ServiceDC.API.getProductReleases(products[index].name, function (resp) {

//             var releases = resp.productRelease_asArray;

//             for (var r in releases) {
//                 var pr = {};
//                 pr.name = products[index].name;
//                 pr.description = products[index].description;
//                 pr.attributes_asArray = products[index].attributes_asArray;
//                 pr.version = releases[r].version;
//                 pr.metadata = {};
//                 for (var m in products[index].metadatas_asArray) {
//                     pr.metadata[products[index].metadatas_asArray[m].key] = products[index].metadatas_asArray[m].value;
//                 }
//                 self.releasesList.push(pr);
//             }

//             index ++;

//             if (index == products.length) {
//                 callback(self.releasesList);
//             } else {
//                 self.getReleases(products, index, callback, error);
//             }

//         }, function(e) {

//             console.log('ERROR getting releases of product: ', products[index].name);

//             index ++;

//             if (index == products.length) {
//                 callback(self.releasesList);
//             } else {
//                 self.getReleases(products, index, callback, error);
//             }
//         }, this.getRegion());
//     }
// });