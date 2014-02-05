var InstanceConnectionView = Backbone.View.extend({

    _template: _.itemplate($('#instanceConnectionTemplate').html()),

    vncResp: false,

    initialize: function() {

        var self = this;
        this.options = this.options || {};

        this.model.fetch({success: function(){
            if (JSTACK.Keystone.getservice("network") !== undefined) {
                if (self.model.get("addresses") != null) {
                    var addresses = self.model.get("addresses");
                    for (var i in addresses) {
                        var ips = addresses[i];
                        for (var j in ips) {
                            if (ips[j]['OS-EXT-IPS:type'] === 'floating') {
                                self.public_ip = ips[j].addr;
                                break;
                            }
                        }
                    }
                }
            } else {
                if ((self.model.get("addresses") != null) && self.model.get("addresses")["public"] !== null) {
                    this.public_ip = self.model.get("addresses")["public"][0];
                }
            }              
            self.render();
        }});

        var options = {};
        // options.callback = function(resp) {
        //     self.options.vncUrl = resp.console.url.replace("127.0.0.1", "130.206.82.10");
        //     self.vncResp = true;
        //     self.render();
        // };
        // this.model.vncconsole(options);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
    },

    render: function () {
        var self = this;

        var template = self._template({vncUrl: self.options.vncUrl, public_ip: self.public_ip});
        $(self.el).empty().html(template);

        return this;
    }
});
