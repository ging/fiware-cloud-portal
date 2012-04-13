var FlavorView = Backbone.View.extend({
    
    _template: _.template($('#flavorsTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.rerender, this);
        this.model.fetch();
    },
    
    events: {
        'click #flavor_delete': 'onDeleteFlavor',
        'click #confirm_delete': 'onDeleteFlavors',
        'click #flavors_delete': 'displayDeletePage',
        'change .checkbox':'enableDisableDeleteButton',
    },

   
  	enableDisableDeleteButton: function (e) {
  		console.log("enableDisableDeleteButton called");
  		for (var index = 0; index < this.model.length; index++) { 
			var instanceId = this.model.models[index].get('id');	 
			if($("#checkbox_"+instanceId).is(':checked'))
				{
   		   	   			$("#flavors_delete").attr("disabled", false);
						return;
				}
		}
		$("#flavors_delete").attr("disabled", true);
			
    },
       
    onDeleteFlavor: function(e){
       	e.preventDefault();                        
       	var flavor =  this.model.get(e.target.value);        
        console.log(e.target.value);         
        flavor.destroy();  
        this.model.fetch();      
    },	
    
    displayDeletePage: function(e){
       	$('.modal_hide_in ').show();
    },	
    
    onDeleteFlavors: function(e){
    	e.preventDefault();          	
  		for (var index = 0; index < this.model.length; index++) { 
		var flavorId = this.model.models[index].get('id');	 		
		if($("#checkbox_"+flavorId).is(':checked'))
				{
				var flavor =  this.model.models[index];      
        		console.log("Flavor to delete = " +this.model.models[index].get('id'));
        		flavor.destroy();      
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