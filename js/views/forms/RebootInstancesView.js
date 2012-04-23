var RebootInstancesView = Backbone.View.extend({
    
    _template: _.template($('#rebootInstancesFormTemplate').html()),
    
    events: {
        'click #cancelBtn': 'close',
      	'click #close': 'close',
      	'click .modal-backdrop': 'close',
      	'click #confirm_reboot': 'onRebootInstance'
    },
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
   	render: function () {
        if ($('#instances_reboot').html() != null) {
            $('#instances_reboot').remove();
        	$('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    onRebootInstance: function(e){
    	e.preventDefault();	
  		for (var index = 0; index < this.model.length; index++) { 
		var instanceId = this.model.models[index].get('id');	 		
		if($("#checkbox_"+instanceId).is(':checked'))
				{
				var instance =  this.model.models[index];      
        		console.log("Instances to reboot = " +this.model.models[index].get('id'));
        		//instance.reboot("soft", options); 
        		$('#instances_reboot').remove();
        		$('.modal-backdrop').remove();     
				}
      	}  
      	this.model.fetch();  
    },	
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#instances_reboot').remove();
        $('.modal-backdrop').remove();
    },
   
});