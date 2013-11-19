var Router = Backbone.Model.extend({

    _action:function(method, options) {
          var model = this;
          if (options == null) options = {};
          options.success = function(resp) {

              model.trigger('sync', model, resp, options);
              if (options.callback !== undefined) {
                  options.callback(resp);
              }
          };
          var xhr = (this.sync || Backbone.sync).call(this, method, this, options);

          return xhr;
    },

    addinterfacetorouter: function(pool, options) {
      console.log("addinterfacetorouter");
      options = options || {};
      options.pool = pool;
      return this._action('addinterfacetorouter', options);
    },

    removeinterfacefromrouter: function(server_id, options) {
      console.log("removeinterfacefromrouter");
      options = options || {};
      options.server_id = server_id;
      return this._action('emoveinterfacefromrouter', options);
    },

    sync: function(method, model, options) {
           switch(method) {
              case "read":
                   JSTACK.Neutron.getrouterdetail(model.get("id"), options.success, options.error);
                   break;
              case "create":
                   JSTACK.Neutron.createrouter(model.get("name"), model.get("admin_state_up"), model.get("network_id"), model.get("tenant_id"), options.success, options.error);
                   break;
              case "delete":
                   JSTACK.Neutron.deleterouter(model.get("id"), options.success, options.error);
                   break;
              case "update":
                    JSTACK.Neutron.updaterouter(model.get("id"), model.get("external_gateway_info:network_id"), model.get("name"), model.get("admin_state_up"), options.success, options.error);
                    break;
              case "addinterfacetorouter":
                    JSTACK.Neutron.addinterfacetorouter(model.get("id"), model.get("subnet_id"), model.get("port_id"), model.get("tenant_id"), options.success, options.error);
                    break;
              case "removeinterfacefromrouter":
                    JSTACK.Neutron.removeinterfacefromrouter(model.get("id"), model.get("subnet_id"), model.get("port_id"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.routers !== undefined) {
            return resp.routers;
        } else {
            return resp;
        }
    }
});

var Routers = Backbone.Collection.extend({
    model: Router,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getrouterslist(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.routers;
    }

});