var ConsultImageDetailView = Backbone.View.extend({
    
    _template: _.template($('#consultImageDetailFormTemplate').html()),
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
    render: function () {
        if ($('#consult_image').html() != null) {
          	$('#consult_image').remove();
        }
        $(this.el).find('#content').replaceWith(this._template({model:this.model}));
        console.log(this.el);
       	return this;
    },	
          
});