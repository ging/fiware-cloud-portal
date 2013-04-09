var Role = Backbone.Model.extend({
});

var Roles = Backbone.Collection.extend({
    model: Role,

    sync: function(method, model, options) {
        if(method === "read") {
            var resp = JSTACK.Keystone.getroles(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.roles;
    }

});