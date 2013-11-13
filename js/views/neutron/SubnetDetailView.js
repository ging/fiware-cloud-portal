var SubnetDetailView = Backbone.View.extend({

    _template: _.itemplate($('#subnetDetailTemplate').html()),

    initialize: function() {
        var self = this;
        this.model.bind("change", this.render, this);
        this.model.fetch({success: function() {
            self.render();
        }});
    },

    events: {
        'click #network_id': 'openNetworkOverview'
    },

    openNetworkOverview: function() {
        network_id = this.model.attributes.subnet.network_id;
        window.location.href = "#neutron/networks/" + network_id;
    },

    render: function () {
        if ($("#subnet_overview").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model});
        } else {
            $(this.el).html(this._template({model:this.model}));
        }
        return this;
    }

});