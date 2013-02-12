var Quota = Backbone.Model.extend({
    sync: function(method, model, options) {
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