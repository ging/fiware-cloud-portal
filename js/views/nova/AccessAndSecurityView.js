var AccessAndSecurityView = Backbone.View.extend({
    
    _template: _.template($('#novaAccessAndSecurityTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.model.fetch();
    },
    
    events: {
        "click .delete_keypair": "onDeleteKeyPair"
    },
    
    onDeleteKeyPair: function (e) {
        var keypair =  this.model.get(e.target.value);
        console.log(keypair.get("name"));
        //TODO Remove Keypair
    },
    
    render: function () {
        console.log(this.model.models);
        if ($("#floating_ips").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        } else {
            $(this.el).html(this._template(this.model));
        }
        return this;
    },
});