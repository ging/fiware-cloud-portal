var Service = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Keystone.getservice(model.get("id"), options.success, options.error);
                   break;
               case "filter":
                   JSTACK.Keystone.filterservice(model.get("id"), options.success, options.error);
                   break;
           }
   }
});

var Services = Backbone.Collection.extend({
    model: Service,

    sync: function(method, model, options) {
        if(method === "read") {
            var resp = JSTACK.Keystone.getservicelist();
            options.success(resp);
        }
    },

    parse: function(resp) {
        return resp;
    }

});