var Overview = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success, options.error);
                   break;
               case "downloadSummary":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success, options.error);
                   break;
           }
   }
});

var Overviewes = Backbone.Collection.extend({
    model: Overview,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getusagesummary(true, options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.overview;
    }

});