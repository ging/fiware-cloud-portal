var Instance = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getserverdetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteserver(model.get("id"), options.success);
                   break;
           }
   }
});

var Instances = Backbone.Collection.extend({
    model: Instance,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getserverlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.instances;
    }
    
});