var Subnet = Backbone.Model.extend({

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
                   JSTACK.Neutron.getsubnetdetail(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "create":
                   JSTACK.Neutron.createsubnet(model.get("network_id"), model.get("cidr"), model.get("name"), model.get("allocation_pools"), 
                   model.get("tenant_id"), model.get("gateway_ip"), model.get("ip_verion"), model.get("enable_dhcp"), model.get("dns_nameservers"),
                   model.get("host_routers"), options.success, options.error, this.getRegion());
                   break;
              case "delete":
                   JSTACK.Neutron.deletesubnet(model.get("id"), options.success, options.error, this.getRegion());
                   break;
              case "update":
                    JSTACK.Neutron.updatesubnet(model.get("id"), model.get("name"), model.get("gateway_ip"), model.get("enable_dhcp"), model.get("dns_nameservers"), 
                    model.get("host_routes"), options.success, options.error, this.getRegion());
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

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Neutron.getsubnetslist(options.success, options.error, this.getRegion());
        }
    },

    parse: function(resp) {
        return resp.subnets;
    }

});