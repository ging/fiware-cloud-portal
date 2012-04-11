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
                   JSTACK.Keystone.createuser(model.get("id"), options.success);
                   break;
               case "filter":
                   JSTACK.Keystone.filteruser(model.get("id"), options.success);
                   break;
               case "edit":
                   JSTACK.Keystone.edituser(model.get("id"), options.success);
                   break;
           }
   }
});

var Users = Backbone.Collection.extend({
    model: User,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Keystone.getusers(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.users;
    }
    
});