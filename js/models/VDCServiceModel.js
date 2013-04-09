var VDCService = Backbone.Model.extend({

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Nova.getcontainerdetail(model.get("id"), options.success, options.error);
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
                        options.success({id: "mockService", name: "mockService", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1, models: array});
                   };
                   JSTACK.Nova.getserverlist(true, this.alltenants, result);

                   break;
               case "delete":
                   //JSTACK.Nova.deletecontainer(model.get("id"), options.success, options.error);
                   break;
               case "create":
                   //JSTACK.Nova.createcontainer( model.get("name"), undefined, undefined, options.success, options.error);
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
        //resp.name = resp._name;
        //resp.id = resp._name;
        if (resp.service !== undefined) {
            return resp.service;
        } else {
            return resp;
        }
    }
});

var VDCServices = Backbone.Collection.extend({
    model: VDCService,
    _vdc: undefined,

    sync: function(method, model, options) {
        if(method == "read") {
          //JSTACK.Nova.getcontainerlist(true, options.success, options.error);
          //OVF.API.getServices(_vdc, options.success, options.error);
          var service = new VDCService({id: "mockService", name: "mockService", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1});
          options.success([service]);
        }
    },

    comparator: function(service) {
        return service.get("id");
    },

    parse: function(resp) {
      console.log(resp);
        return resp;
    },

    vdc: function(value) {
        _vdc = value;
    }

});