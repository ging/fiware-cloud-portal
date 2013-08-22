var AccessAndSecurityView = Backbone.View.extend({

    _template: _.itemplate($('#novaAccessAndSecurityTemplate').html()),

    keypairsView: undefined,
    securityGroupsView: undefined,
    floatingIPsView: undefined,

    initialize: function() {
        this.render();
        console.log($("#floating_ips").html());
        this.floatingIPsView = new NovaFloatingIPsView({model: this.options.floatingIPsModel, pools: this.options.floatingIPPoolsModel, instances: this.options.instances, el: '#floating_ips'});
        this.secuirtyGroupsView = new NovaSecurityGroupsView({model: this.options.securityGroupsModel, el: '#security_groups'});
        this.keyparisView = new NovaKeypairsView({model: this.model, el: '#keypairs'});
    },


    close: function(e) {
        this.options.securityGroupsModel.unbind("change", this.render, this);
        this.options.floatingIPsModel.unbind("change", this.render, this);
        this.options.floatingIPPoolsModel.unbind("change", this.render, this);
        this.model.unbind("change", this.render, this);
        this.undelegateEvents();
        this.unbind();
    },

    onClose: function() {
        this.keyparisView.close();
        this.secuirtyGroupsView.close();
        this.floatingIPsView.close();
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);

    }

});