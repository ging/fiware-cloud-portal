var RouterOverviewView = Backbone.View.extend({

    _template: _.itemplate($('#routerOverviewTemplate').html()),

    initialize: function() {
        var self = this;
        this.model.bind("change", this.render, this);
        this.model.fetch({success: function() {
            self.render();
        }});
    },

    render: function () {
        if ($("#router_overview").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model, networks:this.options.networks});
        } else {
            $(this.el).html(this._template({model:this.model, networks:this.options.networks}));
        }
        return this;
    }

});