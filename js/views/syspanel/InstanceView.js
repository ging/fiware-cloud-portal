var InstanceView = Backbone.View.extend({
    
    _template: _.template($('#instancesTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.rerender, this);
        this.model.fetch();
    },
    
    events:{
   		'change .checkbox':'enableDisableTerminateButton',
   		'click #instances_terminate':'displayTerminatePage',
  	},
  	
  	enableDisableTerminateButton: function () {
  		console.log("Alo called");
  		if($("#instances_terminate").attr("disabled") == 'disabled'){ 
   		   $("#instances_terminate").attr("disabled", false);
		} else { 
   		   $("#instances_terminate").attr("disabled", true);
		}
    },
  	
  	/*enableDisableTerminateButton: function (e) {
  		console.log("enableDisableTerminateButton called");
  		var numChecked = 0;
  		
  		var instanceId =  e.target.value;
  		console.log(this.model.get('id'));
  		console.log(e);   
  		console.log(instanceId);
  		
  		
  		for (var index in instances) { 
		var instance = instances[index];	
		var instanceId = instance.get('id');	
			if($("#checkbox_").is(':checked'))
				{
					//console.log(checked);
					numChecked++;
				}
		}	
		if (numChecked == 0) { 
  		//$("#instances_terminate").attr("disabled", false);
  			if($("#instances_terminate").attr("disabled") == ''){ 
   		   	   $("#instances_terminate").attr("disabled", true);
			} 
		} else {
  			if($("#instances_terminate").attr("disabled") == 'disabled'){ 
   		   	   $("#instances_terminate").attr("disabled", false);
			} else { 
   		   	   $("#instances_terminate").attr("disabled", true);
			}		
		}
			
    },*/
    
    displayTerminatePage: function () {
  		console.log("displayTerminatePage called");
  		if($('.modal hide ').css('display') == 'none'){ 
   		   $('.modal hide ').show('slow'); 
		} else { 
   		   $('.modal hide ').hide('slow'); 
		}
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
       
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }
});