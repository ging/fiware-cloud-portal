var Quota = Backbone.Model.extend({
    sync: function(method, model, options) {
        switch(method) {
               case "read":
                   JSTACK.Nova.getquotalist(model.get("id"), options.success, options.error);
                   break;
                case "update":
                    JSTACK.Nova.updatequota(
                        model.get("id"), 
                        model.get("instances"), 
                        model.get("cores"), 
                        model.get("ram"), 
                        model.get("volumes"),
                        model.get("gigabytes"), 
                        model.get("floating_ips"), 
                        model.get("metadata_items"), 
                        model.get("injected_files"), 
                        model.get("injected_file_content_bytes"), 
                        undefined, 
                        model.get("security_groups"), 
                        model.get("security_group_rules"), 
                        undefined, 
                        options.success, 
                        options.error);
                break;
       }
    }

});

var Quotas = Backbone.Collection.extend({
    model: Quota,

    sync: function(method, model, options) {
    },


});