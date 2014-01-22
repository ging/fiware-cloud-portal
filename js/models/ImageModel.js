var ImageVM = Backbone.Model.extend({

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Glance.getimagedetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
               case "delete":
                   JSTACK.Glance.deleteimage(model.get("id"), options.success, options.error, this.getRegion());
                   break;
               case "update":
                    JSTACK.Glance.updateimage(model.get("id"), model.get("name"), model.get("visibility"), undefined, options.success, options.error, this.getRegion());
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

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Glance.getimagelist(true, options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.images;
    }

});