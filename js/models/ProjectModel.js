var Project = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Keystone.gettenant(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Keystone.deletetenant(model.get("id"), options.success);
                    break;
               case "create":
                   JSTACK.Keystone.createtenant(model.get("name"), model.get("description"), model.get("enabled"), options.success);
                   break;
               //case "filter":
               //    JSTACK.Keystone.filtertenant(model.get("id"), options.success);
               //    break;
           }
   }
});

var Projects = Backbone.Collection.extend({
    model: Project,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Keystone.gettenants(options.success);
        }
    },

    parse: function(resp) {
        return resp.tenants;
    }

});