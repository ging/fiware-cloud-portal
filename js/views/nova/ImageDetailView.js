var ConsultImageDetailView = Backbone.View.extend({

    _template: _.itemplate($('#consultImageDetailFormTemplate').html()),

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },

    render: function () {
        if ($("#instance_details").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model});
        } else {
            $(this.el).html(this._template({model:this.model}));
        }
        return this;
    }

});