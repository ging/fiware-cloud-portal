var VDCService = Backbone.Model.extend({
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Nova.getcontainerdetail(model.get("id"), options.success);
                  // TODO Get Instances for this service.
                   var result = function(servers) {
                        var instances = servers.servers;
                        var array = [];
                        for (var inst in instances) {
                            if (instances.hasOwnProperty(inst)) {
                                var instance = new Instance(instances[inst]);
                                array.push(instance);
                            }
                        
                        }
                        options.success({service:{id: "mockService", name: "mockService", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1, models: array}});
                   };
                   JSTACK.Nova.getserverlist(true, this.alltenants, result);
                   
                   break;
               case "delete":
                   //JSTACK.Nova.deletecontainer(model.get("id"), options.success);
                   break;
               case "create":
                   //JSTACK.Nova.createcontainer( model.get("name"), undefined, undefined, options.success);
                   break;
           }
    },
    
    getInstance: function(instance_id) {
        var models = this.get("models");
        for (var inst in models) {
            if (models.hasOwnProperty(inst)) {
                var instance = models[inst];
                if (instance_id === instance.id) {
                    return instance;
                }
            }
        }    
    },
    
    parse: function(resp) {
        if (resp.service != undefined) {
            return resp.service;
        } else {
            return resp;
        }
    }
});

var VDCServices = Backbone.Collection.extend({
    model: VDCService,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                //JSTACK.Nova.getcontainerlist(true, options.success);
                var service = new VDCService({id: "mockService", name: "mockService", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1});
                options.success({services:[service]});
                break;
        }
    },
    
    comparator: function(service) {
        return service.get("id");
    },
    
    parse: function(resp) {
        return resp.services;
    }
    
});