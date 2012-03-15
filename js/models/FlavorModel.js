var Flavor = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getflavordetail(model.get("id"), options.success);
                   break;
           }
   }
});

var Flavors = Backbone.Collection.extend({
    model: Flavor,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getflavorlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.flavors;
    }
    
});