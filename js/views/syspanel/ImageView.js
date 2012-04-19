var ImagesView = Backbone.View.extend({
    
    _template: _.template($('#imagesTemplate').html()),
        
   	initialize: function() {
         this.model.unbind("reset");
         this.model.bind("reset", this.render, this);
         this.model.fetch();
    },
        
	events: {
        'change .checkbox_image':'enableDisableDeleteButton',
        'click #images_delete': 'checkIfDisabled'
    },  
    
    checkIfDisabled: function (e) {
  		for (var index = 0; index < this.model.length; index++) { 
			var imageId = this.model.models[index].get('id');	 
			if($("#checkbox_"+imageId).is(':checked'))
				{
					$("#images_delete").attr("href", "#syspanel/images/delete");
				}
		}	console.log("Button disabled");		
    },  	
		
	enableDisableDeleteButton: function (e) {
  		console.log("enableDisableDeleteButton called");
  		for (var index = 0; index < this.model.length; index++) { 
			var imageId = this.model.models[index].get('id');	
			console.log(imageId); 
			if($("#checkbox_"+imageId).is(':checked'))
				{
						
   		   	   			$("#images_delete").attr("disabled", false);
						return;
				}
		}
		$("#images_delete").attr("disabled", true);
			
    },
	
    render: function () {
        if ($("#images").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        } else {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var imageId = this.model.models[index].id;
                if ($("#checkbox_"+imageId).is(':checked')) {
                    checkboxes.push(imageId);
                }
                if ($("#dropdown_"+imageId).hasClass('open')) {
                    dropdowns.push(imageId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var imageId = checkboxes[index];
                var check = $("#checkbox_"+imageId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var imageId = dropdowns[index];
                var drop = $("#dropdown_"+imageId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }           
        }
        this.enableDisableDeleteButton();
        return this;
    },
    
});