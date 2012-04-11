var Flavor = Backbone.Model.extend({
	
	_action:function(method, options) {
         options.success = function(resp) {
                model.trigger('sync', model, resp, options);
            }
            var xhr = (this.sync || Backbone.sync).call(this, _method, this, options);
            return xhr;
    },
         
    delete_flavor: function(soft, options) {
       options.soft = soft;
       return _action("delete_flavor", options);
    },
	
	deleteFlavor: function(flavor_id) {
	    
	    console.log("deleteFlavor called");
	    
        this.set({'flavor_id': flavor_id});
        
        this.save();

   },
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getflavordetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteflavor(model.get("id"), options.success);
               		break;
               case "create":
                   JSTACK.Nova.createflavor(model.get("flavor_id"), model.get("name"), model.get("vcpus"), 
                   model.get("memory_mb"), model.get("disk_gb"), model.get("eph_gb"), options.success);
                   break;
           }
   }
});

var Flavors = Backbone.Collection.extend({
    model: Flavor,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getflavorlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.flavors;
    }
    
});