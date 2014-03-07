var Network = Backbone.Model.extend({

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
                   JSTACK.Neutron.getnetworkdetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "create":
                   JSTACK.Neutron.createnetwork(model.get("name"), model.get("admin_state_up"), model.get("shared"), model.get("tenant_id"), options.success, options.error, this.getRegion());
                   break;
              case "delete":
                   JSTACK.Neutron.deletenetwork(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "update":
                    JSTACK.Neutron.updatenetwork(model.get("id"), model.get("name"), model.get("admin_state_up"), options.success, options.error, this.getRegion());
                    break;
           }
   },

    parse: function(resp) {
      return resp;
    }
});

var Networks = Backbone.Collection.extend({
    model: Network,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getnetworkslist(options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp;
    }

});