var User = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Keystone.getuser(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Keystone.deleteuser(model.get("id"), options.success);
                     break;
               case "create":
                   JSTACK.Keystone.createuser(model.get("name"), model.get("password"), model.get("tenant_id"), model.get("email"), mode.get("enabled"), options.success);
                   break;
               //case "filter":
               //    JSTACK.Keystone.filteruser(model.get("id"), options.success);
               //    break;
               //case "edit":
               //    JSTACK.Keystone.edituser(model.get("id"), options.success);
               //    break;
           }
   }
});

var Users = Backbone.Collection.extend({
    model: User,
    _tenant_id: undefined,

    sync: function(method, model, options) {
        if(method === "read") {
            console.log(this._tenant_id);
            if (this._tenant_id !== undefined) {
              JSTACK.Keystone.getusersfortenant(this._tenant_id, options.success);
            } else {
              JSTACK.Keystone.getusers(options.success);
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