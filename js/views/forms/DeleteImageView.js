var DeleteImageView = Backbone.View.extend({
    
    _template: _.template($('#deleteImageFormTemplate').html()),
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
    events: {
        'click #image_delete': 'onDeleteImage',
        'click #cancelBtn': 'close',
      	'click #close': 'close',
      	'click .modal-backdrop': 'close'
    },
    
   	render: function () {
        console.log("Rendering delete image");
         console.log("HTML = "+$('#delete_image').html());
        if ($('#delete_image').html() != null) {        	
            //return;
            $('#delete_image').remove();
        	$('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
        
    },
    
    onDeleteImage: function(e){
       	e.preventDefault();   
       	console.log("Image to delete = "+this.model.get("id"));
		console.log(this.model);                    
       	this.model.destroy();   
       	$('#delete_image').remove();
        $('.modal-backdrop').remove();  
    },		
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#delete_image').remove();
        $('.modal-backdrop').remove();
    },
   
});