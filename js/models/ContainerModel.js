var Container = Backbone.Model.extend({
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Nova.getcontainerdetail(model.get("id"), options.success);
                   options.success({container:{name: "mockContainer", objects: [{name: "mockObject", size: 365}]}});
                   break;
               case "delete":
                   //JSTACK.Nova.deletecontainer(model.get("id"), options.success);
                   break;
               case "create":
                   //JSTACK.Nova.createcontainer( model.get("name"), undefined, undefined, options.success);
                   break;
           }
    },
    
    removeObjects: function(objects) {
    },
    
    parse: function(resp) {
        console.log("Parsing container", resp);
        if (resp.container != undefined) {
            return resp.container;
        } else {
            return resp;
        }
    }
});

var Containers = Backbone.Collection.extend({
    model: Container,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                //JSTACK.Nova.getcontainerlist(true, options.success);
                var cont = new Container({name: "mockContainer", id: 1, size: 365, length: 1});
                options.success({containers:[cont]});
                break;
        }
    },
    
    comparator: function(container) {
        return container.get("id");
    },
    
    parse: function(resp) {
        console.log("Parsing containers", resp);
        return resp.containers;
    }
    
});