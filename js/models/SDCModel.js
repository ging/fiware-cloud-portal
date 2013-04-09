var SDC = Backbone.Model.extend({

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Nova.getcontainerdetail(model.get("id"), options.success, options.error);
                   options.success({vdc:{id: "mockVDC", name: "mockVDC", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1}});
                   break;
               case "delete":
                   //JSTACK.Nova.deletecontainer(model.get("id"), options.success, options.error);
                   break;
               case "create":
                   //JSTACK.Nova.createcontainer( model.get("name"), undefined, undefined, options.success, options.error);
                   break;
           }
    },

    parse: function(resp) {
        if (resp.vdc !== undefined) {
            return resp.vdc;
        } else {
            return resp;
        }
    }
});

var SDCs = Backbone.Collection.extend({
    model: SDC,

    sync: function(method, model, options) {
        if(method === "read") {
            //JSTACK.Nova.getcontainerlist(true, options.success, options.error);
            var vdc = new VDC({id: "mockVDC", name: "mockVDC", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1});
            options.success({vdcs:[vdc]});
        }
    },

    comparator: function(vdc) {
        return vdc.get("id");
    },

    parse: function(resp) {
        return resp.vdcs;
    }

});