var Flavor = Backbone.Model.extend({

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getflavordetail(model.get("id"), options.success, options.error);
                   break;
               case "delete":
                   JSTACK.Nova.deleteflavor(model.get("id"), options.success, options.error);
                   break;
               case "create":
                   JSTACK.Nova.createflavor( model.get("name"), model.get("ram"), model.get("vcpus"),
                            model.get("disk"), model.get("flavor_id"), model.get("ephemeral"), undefined,
                            undefined, options.success, options.error);
                   break;
           }
    },

    parse: function(resp) {
        if (resp.flavor !== undefined) {
            return resp.flavor;
        } else {
            return resp;
        }
    }
});

var Flavors = Backbone.Collection.extend({
    model: Flavor,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getflavorlist(true, options.success, options.error);
        }
    },

    comparator: function(flavor) {
        return flavor.get("id");
    },

    parse: function(resp) {
        return resp.flavors;
    }

});