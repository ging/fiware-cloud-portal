var NetworkDetailView = Backbone.View.extend({

    _template: _.itemplate($('#networkDetailTemplate').html()),

    networkOverviewView: undefined,
    subnetsView: undefined,
    portsView: undefined,

    initialize: function() {
        this.options.subnets = UTILS.GlobalModels.get("subnets");
        this.options.ports = UTILS.GlobalModels.get("ports");
        this.render();
        this.networkOverviewView = new NetworkOverviewView({model: this.model, el: '#network_overview'});
        this.subnetsView = new NetworkSubnetsView({model: this.model, subnets: this.options.subnets, tenant_id: this.options.tenant_id, el: '#subnets'});
        this.portsView = new NetworkPortsView({model: this.model, ports: this.options.ports, el: '#ports'});
    },


    close: function(e) {
        this.model.unbind("change", this.render, this);
        this.options.subnets.unbind("change", this.render, this);
        this.options.ports.unbind("change", this.render, this);
        $('#network_overview').remove();
        $('#subnets').remove();
        $('#ports').remove();
        this.undelegateEvents();
        this.unbind();
    },

    onClose: function() {
        this.networkOverviewView.close();
        this.subnetsView.close();
        this.portsView.close();
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);

    }

});