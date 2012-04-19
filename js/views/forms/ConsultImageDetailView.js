var ConsultImageDetailView = Backbone.View.extend({
    
    _template: _.template($('#consultImageDetailFormTemplate').html()),
    
   	initialize: function() {
   		console.log("Enter consult image");
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
    render: function () {
        console.log("Rendering image detail");
        if ($('#consult_image').html() != null) {
          	$('#consult_image').remove();
        }
        $(this.el).find('#content').replaceWith(this._template({model:this.model}));
        console.log(this.el);
       	return this;
    },	
          
});