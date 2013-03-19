var Quota = Backbone.Model.extend({
    sync: function(method, model, options) {
        if (method === "update") {
            console.log(model.get("instances"), model.get("cores"), model.get("ram"), model.get("volumes"),
            model.get("gigabytes"), model.get("floating_ips"), model.get("metadata_items"), model.get("injected_files"), 
            model.get("injected_file_content_bytes"), model.get("security_groups"), 
            model.get("security_group_rules"));
            JSTACK.Nova.updatequota(model.get("instances"), model.get("cores"), model.get("ram"), model.get("volumes"),
            model.get("gigabytes"), model.get("floating_ips"), model.get("metadata_items"), model.get("injected_files"), 
            model.get("injected_file_content_bytes"), model.get("security_groups"), 
            model.get("security_group_rules"), options.success);
       }
    }

});

var Quotas = Backbone.Collection.extend({
    model: Quota,

    sync: function(method, model, options) {
        if(method === "read") {
            JSTACK.Nova.getquotalist(options.success);
        }
    },

    parse: function(resp) {
        return resp.quota_set;
    }

});