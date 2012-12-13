var FloatingIP = Backbone.Model.extend({
    
    initialize: function() {
        this.id = this.get("name");
    },
    
    sync: function(method, model, options) {
           switch(method) {
               case "create":            
                   break;
           }
   }
   
});

var FloatingIPs = Backbone.Collection.extend({
    model: FloatingIP,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                
                break;
        }
    },
    
    parse: function(resp) {
       return resp;
    }
    
});