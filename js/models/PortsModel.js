var Port = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
              case "read":
                   JSTACK.Neutron.getportdetail(model.get("id"), options.success, options.error);
                   break;
              case "create":
                   JSTACK.Neutron.createport(model.get("name"), options.success, options.error);
                   break;
              case "delete":
                   JSTACK.Neutron.deleteport(model.get("id"), options.success, options.error);
                   break;
              case "update":
                    JSTACK.Neutron.updateport(model.get("id"), model.get("name"), model.get("admin_state_up"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.networks !== undefined) {
            return resp.ports;
        } else {
            return resp;
        }
    }
});

var Ports = Backbone.Collection.extend({
    model: Port,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getportslist(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.ports;
    }

});