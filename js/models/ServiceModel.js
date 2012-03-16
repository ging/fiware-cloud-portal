var Service = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Keystone.getservice(model.get("id"), options.success);
                   break;
               case "filter":
                   JSTACK.Keystone.filterservice(model.get("id"), options.success);
                   break;
           }
   }
});

var Services = Backbone.Collection.extend({
    model: Service,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Keystone.getservice(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.services;
    }
    
});