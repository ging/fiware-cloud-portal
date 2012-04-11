var Flavor = Backbone.Model.extend({
	
	_action:function(method, options) {
         options.success = function(resp) {
                model.trigger('sync', model, resp, options);
            }
            var xhr = (this.sync || Backbone.sync).call(this, _method, this, options);
            return xhr;
    },
         
    create: function(soft, options) {
       options.soft = soft;
       return _action("create", options);
    },
	
	submitForm: function(flavor_id, name, vcpus, memory_mb, disk_gb, eph_gb) {
	    
	    console.log("submitForm called");
	    
        this.set({'flavor_id': flavor_id});
        this.set({'name': name});
        this.set({'vcpus': vcpus});
        this.set({'memory_mb': memory_mb});
        this.set({'disk_gb': disk_gb});
        this.set({'eph_gb': eph_gb});
        
        this.save();

   },
    
	
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getflavordetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deleteflavors(model.get("id"), options.success);
               		break;
               case "create":
                   JSTACK.Nova.createflavor(model.get("flavor_id"), model.get("name"), model.get("vcpus"), 
                   model.get("memory_mb"), model.get("disk_gb"), model.get("eph_gb"), options.success);
                   break;
           }
   }
});

