var Image = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success);
                   break;
           }
   }
});

var Images = Backbone.Collection.extend({
    model: Image,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getimagelist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        console.log(resp);
        return resp.images;
    }
    
});