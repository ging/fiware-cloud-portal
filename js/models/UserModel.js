var User = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Keystone.getuser(model.get("id"), options.success, options.error);
                   break;
               case "delete":
                   JSTACK.Keystone.deleteuser(model.get("id"), options.success, options.error);
                     break;
               case "create":
                   JSTACK.Keystone.createuser(model.get("name"), model.get("password"), model.get("tenant_id"), model.get("email"), model.get("enabled"), options.success, options.error);
                   break;
               case "get-roles":
                   JSTACK.Keystone.getuserroles(model.get("id"), options.tenant, options.success, options.error);
                   break;
               case "add-role":
                   JSTACK.Keystone.adduserrole(model.get("id"), options.role, options.tenant, options.success, options.error);
                   break;
               case "remove-role":
                   JSTACK.Keystone.removeuserrole(model.get("id"), options.role, options.tenant, options.success, options.error);
                   break;
               case "update":
                   JSTACK.Keystone.edituser(model.get("id"), model.get("name"), model.get("password"), model.get("tenant_id"), model.get("email"), model.get("enabled"), options.success, options.error);
                   break;
           }
   },

   addRole: function(role, tenant, options) {
      options = options || {success: function(){}};
      options.role = role;
      options.tenant = tenant;
      this.sync("add-role", this, options);
   },

   getRoles: function(tenant, options) {
      options = options || {success: function(){}};
      options.tenant = tenant;
      this.sync("get-roles", this, options);
   },

   removeRole: function(role, tenant, options) {
      options = options || {success: function(){}};
      options.role = role;
      options.tenant = tenant;
      this.sync("remove-role", this, options);
   }

});

var Users = Backbone.Collection.extend({
    model: User,
    _tenant_id: undefined,

    sync: function(method, model, options) {
        if(method === "read") {
            if (this._tenant_id !== undefined) {
              JSTACK.Keystone.getusersfortenant(this._tenant_id, options.success, options.error);
            } else {
              JSTACK.Keystone.getusers(options.success, options.error);
            }
        }
    },

    parse: function(resp) {
        return resp.users;
    },

    tenant: function(tenant_id) {
        this._tenant_id = tenant_id;
    }

});