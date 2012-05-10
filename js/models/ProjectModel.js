var Project = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Keystone.gettenants(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Keystone.deletetenant(model.get("id"), options.success);
               		break;
               case "create":
                   JSTACK.Keystone.createtenant(model.get("id"), options.success);
                   break;
               case "filter":
                   JSTACK.Keystone.filtertenant(model.get("id"), options.success);
                   break;
           }
   }
});

var Projects = Backbone.Collection.extend({
    model: Project,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Keystone.gettenants(options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.tenants;
    }
    
});