var Quota = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
               case "filter":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success);
                   break;
           }
   }
});

var Quotas = Backbone.Collection.extend({
    model: Quota,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getusagesummary(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.quota;
    }
    
});