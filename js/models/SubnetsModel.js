var Subnet = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
              case "read":
                   JSTACK.Neutron.getsubnetdetail(model.get("id"), options.success, options.error);
                   break;
              case "create":
                   JSTACK.Neutron.createsubnet(model.get("name"), options.success, options.error);
                   break;
              case "delete":
                   JSTACK.Neutron.deletesubnet(model.get("id"), options.success, options.error);
                   break;
              case "update":
                    JSTACK.Neutron.updatesubnet(model.get("id"), model.get("name"), model.get("admin_state_up"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.networks !== undefined) {
            return resp.subnets;
        } else {
            return resp;
        }
    }
});

var Subnets = Backbone.Collection.extend({
    model: Subnet,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getsubnetslist(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.subnets;
    }

});