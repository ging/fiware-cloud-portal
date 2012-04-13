var InstanceView = Backbone.View.extend({
    
    _template: _.template($('#instancesTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.rerender, this);
        this.model.fetch();
    },
    
    events:{
   		'change .checkbox':'enableDisableTerminateButton',
   		'click #instances_terminate':'displayTerminatePage',
  	},
  	
  	/*enableDisableTerminateButton: function () {
  		console.log("Alo called");
  		if($("#instances_terminate").attr("disabled") == 'disabled'){ 
   		   $("#instances_terminate").attr("disabled", false);
		} else { 
   		   $("#instances_terminate").attr("disabled", true);
		}
    },*/
  	
  	enableDisableTerminateButton: function () {
  		for (var index in this.model.models) { 
    		var instance = this.model.models[index];
    		var instanceId = instance.get('id');
			if($("#checkbox_"+instanceId).is(':checked'))
				{
					console.log("checked");
					$("#instances_terminate").attr("disabled", false);
					return;
		    }
		}
		$("#instances_terminate").attr("disabled", true);
    },
    
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