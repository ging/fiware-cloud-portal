var ImageVM = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Glance.getimagedetail(model.get("id"), options.success, options.error);
                   break;
               case "delete":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success, options.error);
                   break;
               case "update":
                    JSTACK.Nova.updateimage(model.get("id"), model.get("name"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.image !== undefined) {
            return resp.image;
        } else {
            return resp;
        }
    }
});

var Images = Backbone.Collection.extend({
    model: ImageVM,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Glance.getimagelist(true, options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.images;
    }

});