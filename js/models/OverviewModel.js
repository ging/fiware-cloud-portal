var Overview = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
               case "downloadSummary":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
           }
   }
});

var Overviewes = Backbone.Collection.extend({
    model: Overview,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getusagesummary(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.overview;
    }
    
});