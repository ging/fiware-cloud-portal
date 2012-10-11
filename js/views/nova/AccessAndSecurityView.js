var AccessAndSecurityView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaAccessAndSecurityTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.model.fetch();
    },
    
    events: {
        "click .delete_keypair": "onDeleteKeyPair"
    },
    
    onDeleteKeyPair: function (e) {
        var keypair =  this.model.get(e.target.value);
        //TODO Remove Keypair
    },
    
    render: function () {
        if ($("#floating_ips").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        } else {
            $(this.el).html(this._template(this.model));
        }
        return this;
    }
});