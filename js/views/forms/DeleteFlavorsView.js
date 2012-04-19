var DeleteFlavorsView = Backbone.View.extend({
    
    _template: _.template($('#deleteFlavorsFormTemplate').html()),
    
    events: {
        'click #confirm_delete': 'onDeleteFlavors',
        'click #cancelBtn': 'close',
      	'click #close': 'close',
      	'click .modal-backdrop': 'close'
    },
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
   	render: function () {
        console.log("Rendering delete flavors");
        if ($('#delete_flavors').html() != null) {
            //return;
            $('#delete_flavors').remove();
        	$('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    onDeleteFlavors: function(e){
    	console.log(this.model.models);
    	e.preventDefault();	
  		for (var index = 0; index < this.model.length; index++) { 
		var flavorId = this.model.models[index].get('id');	 		
		if($("#checkbox_"+flavorId).is(':checked'))
				{
				var flavor =  this.model.models[index];      
        		console.log("Flavor to delete = " +this.model.models[index].get('id'));
        		flavor.destroy(); 
        		$('#delete_flavors').remove();
        		$('.modal-backdrop').remove();     
				}
      	}  
      	this.model.fetch();  
    },	
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#delete_flavors').remove();
        $('.modal-backdrop').remove();
    },
   
});