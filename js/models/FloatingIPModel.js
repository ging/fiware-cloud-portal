var FloatingIP = Backbone.Model.extend({

    initialize: function() {
        this.id = this.get("name");
    },

    sync: function(method, model, options) {
    }

});

var FloatingIPs = Backbone.Collection.extend({
    model: FloatingIP,

    sync: function(method, model, options) {

    },

    parse: function(resp) {
       return resp;
    }

});