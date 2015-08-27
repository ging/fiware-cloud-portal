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

//     sync: function(method, model, options) {
//         switch(method) {
//             case 'read':
//                 JSTACK.Murano.getServiceCatalogue(options.success, options.error, this.getRegion());
//                 break;
//             case 'create':
//                 break;
//         }
//     },

//     parse: function(resp) {
//         return resp;
//     }
// });