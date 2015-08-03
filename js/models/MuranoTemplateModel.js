// var BPTemplate = Backbone.Model.extend({

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

//     addTier: function(options) {
//         options = options || {};
//         return this._action('addTier', options);
//     },

//     updateTier: function(options) {
//         options = options || {};
//         return this._action('updateTier', options);
//     },

//     deleteTier: function(options) {
//         options = options || {};
//         return this._action('deleteTier', options);
//     },

//     sync: function(method, model, options) {
//         switch(method) {
//             case "read":
//                 JSTACK.Murano.getBlueprintTemplate(model.get('name'), options.success, options.error, this.getRegion());
//                 break;
//             case "create":
//                 JSTACK.Murano.createBlueprintTemplate(model.toJSON(), options.success, options.error, this.getRegion());
//                 break;
//             case "delete":
//                 JSTACK.Murano.deleteBlueprintTemplate(model.id, options.success, options.error, this.getRegion());
//                 break;
//             case "update":
//                 break;
//             case "addTier":
//                 JSTACK.Murano.createBlueprintTemplateTier(model.get('name'), options.tier, options.success, options.error, this.getRegion());
//                 break;
//             case "updateTier":
//                 JSTACK.Murano.updateBlueprintTemplateTier(model.get('name'), options.tier, options.success, options.error, this.getRegion());
//                 break;
//             case "deleteTier":
//                 JSTACK.Murano.deleteBlueprintTemplateTier(model.get('name'), options.tier, options.success, options.error, this.getRegion());
//                 break;
//         }
//     },

//     parse: function(resp) {
//         //resp.id = resp.name;
//         return resp;
//     }
// });

// var BPTemplates = Backbone.Collection.extend({

//     model: BPTemplate,

//     catalogList: {},

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

//     getCatalogBlueprint: function(options) {
//         options = options || {};
//         return this._action('getCatalogBlueprint', options);
//     },

//     fetchCollection: function(options) {

//         var self = this;

//         JSTACK.Murano.getBlueprintCatalogList(function (resp) {
//             JSTACK.Murano.getBlueprintTemplateList(function (resp2) {
//                 self.catalogList = resp;
//                 options.success(resp2);
//             }, options.error);

//         }, options.error);
//     },

//     sync: function(method, model, options) {
//         switch(method) {
//             case "read":
//                 // BlueprintCatalogue not available yet
//                 //this.fetchCollection(options);
//                 JSTACK.Murano.getBlueprintTemplateList(options.success, options.error, this.getRegion());
//                 break;
//             case 'getCatalogBlueprint':
//                 JSTACK.Murano.getBlueprintCatalog(options.id, options.success, options.error);
//                 break;
//         }
//     },

//     parse: function(resp) {
//         return resp;
//     }
// });