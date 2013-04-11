var ImageVM = Backbone.Model.extend({
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   var onOk = function(resp, headers) {
                    var model = {};
                      var heads = headers.split("\r\n");
                      heads.forEach(function(head) {
                        if (head.indexOf('x-image-meta') === -1) {
                          return;
                        }
                        var reg = head.match(/^([\w\d\-\_]*)\: (.*)$/);
                        var value = reg[1];
                        var key = reg[2];
                        var data = value.split('-');
                        var attr = data[data.length-1];
                        model[attr] = key;
                      });
                      options.success(model);
                   };
                   JSTACK.Glance.getimagedetail(model.get("id"), onOk, options.error);
                   break;
               case "delete":
                   JSTACK.Nova.deleteimage(model.get("id"), options.success, options.error);
                   break;
               case "update":
                    JSTACK.Nova.updateimage(model.get("id"), model.get("name"), options.success, options.error);
                    break;
           }
   },

   parse: function(resp) {
        if (resp.image !== undefined) {
            return resp.image;
        } else {
            return resp;
        }
    }
});

var Images = Backbone.Collection.extend({
    model: ImageVM,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Glance.getimagelist(true, options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.images;
    }

});