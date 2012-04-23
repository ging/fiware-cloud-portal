var ConsultImageDetailView = Backbone.View.extend({
    
    _template: _.template($('#consultImageDetailFormTemplate').html()),
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },
    
    render: function () {
        if ($("#consult_image").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model});
        } else {
            $(this.el).html(this._template({model:this.model}));
        }
        return this;
    }
          
});