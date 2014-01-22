var floatingIPPool = Backbone.Model.extend({


});

var FloatingIPPools = Backbone.Collection.extend({
    model: floatingIPPool,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getfloatingIPpools(options.success, options.error, this.getRegion());
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