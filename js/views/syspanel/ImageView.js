var ImagesView = Backbone.View.extend({
    
        _template: _.template($('#imagesTemplate').html()),
        
        initialize: function() {
            this.model.fetch();
            this.model.bind("reset", this.rerender, this);
        },
        
		events: {
        	'click #image_delete': 'onDeleteImage',
        	'click #confirm_delete': 'onDeleteImages',
        	'click #images_delete': 'displayDeletePage',
        	'change .checkbox':'enableDisableDeleteButton',
    	},
    	
		
		enableDisableDeleteButton: function (e) {
  		console.log("enableDisableDeleteButton called");
  		for (var index = 0; index < this.model.length; index++) { 
			var instanceId = this.model.models[index].get('id');	 
			if($("#checkbox_"+instanceId).is(':checked'))
				{
   		   	   			$("#images_delete").attr("disabled", false);
						return;
				}
		}
		$("#images_delete").attr("disabled", true);
			
    },
       
	    onDeleteImage: function(e){
	       	e.preventDefault();                        
	       	var flavor =  this.model.get(e.target.value);        
	        console.log(e.target.value);         
	        flavor.destroy();  
	        this.model.fetch();      
	    },	
	    
	    displayDeletePage: function(e){
	       	$('.modal_hide_in ').show();
	    },	
	    
	    onDeleteImages: function(e){
	    	e.preventDefault(); 
	    	console.log("Enter images delete"); 
	           	
	  		for (var index = 0; index < this.model.length; index++) { 
			var imageId = this.model.models[index].get('id');	 		
			if($("#checkbox_"+imageId).is(':checked'))
					{
					var image =  this.model.models[index];      
	        		console.log("Image to delete = " +this.model.models[index].get('id'));
	        		image.destroy();      
					}
	      	}  
	      	this.model.fetch();  
	    },	
	
        render: function () {
            UTILS.Render.animateRender(this.el, this._template, this.model);
            return this;
        },
        
        rerender: function() {
            $(this.el).empty().html(this._template(this.model));
        }
    });