var floatingIPPool = Backbone.Model.extend({


});

var FloatingIPPools = Backbone.Collection.extend({
    model: floatingIPPool,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getfloatingIPpools(options.success, options.error);
        }
    },

    parse: function(resp) {
        var list = [];
        for (var index in resp.floating_ip_pools) {
            var floating_ip_pool = resp.floating_ip_pools[index];
            list.push(floating_ip_pool);
        }
        return list;
    }

});