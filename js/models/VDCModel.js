var VDC = Backbone.Model.extend({

    sync: function(method, model, options) {
               switch(method) {
                   case "read":
                       //JSTACK.Nova.getcontainerdetail(model.get("id"), options.success, options.error);
                       options.success({vdc:{_name: "mockVDC", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1}});
                       //OVF.API.getVDC(model.get("id"), options.success, options.error);
                       break;
                   case "delete":
                       //JSTACK.Nova.deletecontainer(model.get("id"), options.success, options.error);
                       break;
                   case "create":
                       //JSTACK.Nova.createcontainer( model.get("name"), undefined, undefined, options.success, options.error);
                       /*var vdc = OVF.VDC({description: model.get("description"),
                            name: model.get("name"),
                            id: 3,
                            disk_units: 'byte * 2 * ^ 30',
                            disk_limit: model.get("storage"),
                            cpu_units: '# CPUs',
                            cpu_limit: model.get("vcpus"),
                            memory_limit: model.get("memory"),
                            memory_units: 'byte * 2 ^ 30'});
                        */
                        //vdc.addVirtualNetwork(model.get("network_type"), 1, model.get("network_name"), model.get("network_description"), model.get("network_mode"), 'Mb', model.get("bandwidth"), model.get("network_size"));
                        //vdc.addVirtualNetwork('private_protected', 2, 'management', 'Godzillas Intranet', 'isolated', 'Gb', 1, 254);
                        //console.log(vdc.toXML());
                        //OVF.API.createVDC(vdc);
                       break;
               }
    },

    parse: function(resp) {
        resp.name = resp._name;
        resp.id = resp._name;
        if (resp.vdc !== undefined) {
            return resp.vdc;
        } else {
            return resp;
        }
    }
});

var VDCs = Backbone.Collection.extend({
    model: VDC,

    sync: function(method, model, options) {
        if(method === "read") {
            //JSTACK.Nova.getcontainerlist(true, options.success, options.error);
            var vdc = new VDC({id: "mockVDC", name: "mockVDC", vcpus: 1, disk: 10, ram: 1, vcpu_hours: 1, disk_hours: 1});
            options.success([vdc]);
            //OVF.API.getVDCs(options.success, options.error);
        }
    },

    comparator: function(vdc) {
        return vdc.get("id");
    },

    parse: function(resp) {
        return resp;
    }

});