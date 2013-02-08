var Quota = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   break;
           }
   },
    
});

var Quotas = Backbone.Collection.extend({
    model: Quota,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":                  
            JSTACK.Nova.getquotalist(options.success);
            break;
        }
    },
    
    parse: function(resp) {
        return resp.quota_set;
    }
    
});