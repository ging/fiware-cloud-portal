var ImageVM = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success);
                   break;
               case "update":
                    JSTACK.Nova.updateimage(model.get("id"), model.get("name"), options.success);
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
            JSTACK.Nova.getimagelist(true, options.success);
        }
    },

    parse: function(resp) {
        return resp.images;
    }

});