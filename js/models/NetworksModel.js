var Network = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
              case "read":
                   JSTACK.Neutron.getnetworkdetail(model.get("id"), options.success, options.error);
                   break;
              case "create":
                   JSTACK.Neutron.createnetwork(model.get("name"), model.get("admin_state_up"), model.get("shared"), model.get("tenant_id"), options.success, options.error);
                   break;
              case "delete":
                   JSTACK.Neutron.deletenetwork(model.get("id"), options.success, options.error);
                   break;
              case "update":
                    JSTACK.Neutron.updatenetwork(model.get("id"), model.get("name"), model.get("admin_state_up"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.networks !== undefined) {
            return resp.networks;
        } else {
            return resp;
        }
    }
});

var Networks = Backbone.Collection.extend({
    model: Network,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getnetworkslist(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.networks;
    }

});