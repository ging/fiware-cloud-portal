var Port = Backbone.Model.extend({

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
                   JSTACK.Neutron.getportdetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "create":
                   JSTACK.Neutron.createport(model.get("name"), options.success, options.error, this.getRegion());
                   break;
              case "delete":
                   JSTACK.Neutron.deleteport(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "update":
                    JSTACK.Neutron.updateport(model.get("id"), model.get("name"), model.get("admin_state_up"), options.success, options.error, this.getRegion());
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

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getportslist(options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.ports;
    }

});