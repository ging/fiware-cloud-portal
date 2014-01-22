var Overview = Backbone.Model.extend({

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
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
               case "downloadSummary":
                   JSTACK.Nova.getimagedetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
           }
   }
});

var Overviewes = Backbone.Collection.extend({
    model: Overview,
    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getusagesummary(true, options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.overview;
    }

});