var SecurityGroup = Backbone.Model.extend({
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getsecuritygroupdetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deletesecuritygroup(model.get("id"), options.success);
               	   break;
               case "create":
                   JSTACK.Nova.createsecuritygroup( model.get("name"), model.get("description"), options.success);
                   break;
           }
    },
    
    parse: function(resp) {
        if (resp.flavor != undefined) {
            return resp.flavor;
        } else {
            return resp;
        }
    }
});

var SecurityGroups = Backbone.Collection.extend({
    model: SecurityGroup,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getsecuritygrouplist(options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.security_groups;
    }
    
});