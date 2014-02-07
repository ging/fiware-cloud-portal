var InstanceConnectionView = Backbone.View.extend({

    _template: _.itemplate($('#instanceConnectionTemplate').html()),

    vncResp: false,

    events: {
        'click #vnc-button': 'onVnc'
    },

    initialize: function() {

        var self = this;
        this.options = this.options || {};

        this.model.fetch({success: function(model){
            if (JSTACK.Keystone.getservice("network") !== undefined) {
                if (model.get("addresses") != null) {
                    var addresses = model.get("addresses");
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
                if ((model.get("addresses") != null) && model.get("addresses")["public"] !== null) {
                    if (model.get("addresses")["public"] !== undefined) {
                        this.public_ip = model.get("addresses")["public"][0]; 
                    }
                }
            }              
            self.render();
        }});
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
    },

    onVnc: function () {
        var subview = new VNCView({el: 'body', model: this.model});
        subview.render();
    },

    render: function () {
        var self = this;

        var template = self._template({public_ip: self.public_ip});
        $(self.el).empty().html(template);

        return this;
    }
});
