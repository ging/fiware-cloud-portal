var Keypair = Backbone.Model.extend({
    
    initialize: function() {
        this.id = this.get("name");
    },
    
    sync: function(method, model, options) {
           switch(method) {
               case "create":
                   JSTACK.Nova.createkeypair(model.get("name"), model.get("public_key"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deletekeypair(model.get("name"), options.success);
                   break;
           }
   }
   
});

var Keypairs = Backbone.Collection.extend({
    model: Keypair,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getkeypairlist(options.success);
                break;
        }
    },
    
    parse: function(resp) {
        var list = [];
        for (var index in resp.keypairs) {
            var keypair = resp.keypairs[index];
            list.push(keypair.keypair);
        }
        return list;
    }
    
});