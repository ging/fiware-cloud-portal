var RouterDetailView = Backbone.View.extend({

    _template: _.itemplate($('#routerDetailTemplate').html()),

    routerOverviewView: undefined,
    routerInterfacesView: undefined,

    initialize: function() {
        this.render();
        this.routerOverviewView = new RouterOverviewView({model: this.model, networks: this.options.networks, el: '#router_overview'});
        this.routerInterfacesView = new RouterInterfacesView({model: this.model, subnets: this.options.subnets, networks: this.options.networks, ports: this.options.ports, tenant_id: this.options.tenant_id, el: '#interfaces'});
    },


    close: function(e) {
        this.model.unbind("change", this.render, this);
        this.options.subnets.unbind("change", this.render, this);
        this.options.ports.unbind("change", this.render, this);
        this.options.networks.unbind("change", this.render, this);
        $('#router_overview').remove();
        $('#interfaces').remove();
        this.undelegateEvents();
        this.unbind();
    },

    onClose: function() {
        this.routerOverviewView.close();
        this.routerInterfacesView.close();
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);

    }

});