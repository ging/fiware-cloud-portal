var NetworkOverviewView = Backbone.View.extend({

    _template: _.itemplate($('#networkOverviewTemplate').html()),

    initialize: function() {
        var self = this;
        this.model.bind("change", this.render, this);
        this.model.fetch({success: function() {
            self.render();
        }});
    },

    render: function () {
        if ($("#network_overview").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model});
            console.log(this.model);
        } else {
            $(this.el).html(this._template({model:this.model}));
        }
        return this;
    }

});