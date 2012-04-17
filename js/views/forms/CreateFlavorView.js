var CreateFlavorView = Backbone.View.extend({
    
    _template: _.template($('#createFlavorFormTemplate').html()),
    
    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
      	'click #close': 'close',
    },

   	render: function () {
        console.log("Rendering create flavor");
        if ($('#create_flavor').html() != null) {
            //return;
          	$('#create_flavor').remove();
        	$('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    onSubmit: function(e){
    	console.log("onSubmit called");
        e.preventDefault();
        
      	/*$("#create_flavor_form").validate({ 
	     	rules: { 
	          tenant_id: "required",
	          name: { 
	          required: true 
	          }, 
	          vcpus: {
	          	required: true
	          },
	          memory_mb: {
	          	required: true
	          },
	          disk_gb: {
	          	required: true
	          },	 
	          eph_gb: {
	          	required: true
	          },         	
        	messages: { 
	          tenant_id: "This field is required.",
	          name: "This field is required.", 
	          vcpus: "This field is required.",
	          memory_mb: "This field is required.",
	          disk_gb: "This field is required.",
	          eph_gb: "This field is required."
	        } 
	       }
      });  */
     
     //Check if the fields are not empty, and the numbers are not negative nor decimal
     	if ( (this.$('input[name=flavor_id]').val()=="") ||
     		 (this.$('input[name=name]').val()=="") ||
     		 (this.$('input[name=vcpus]').val()=="") ||
     		 (this.$('input[name=memory_mb]').val()=="") ||
     		 (this.$('input[name=disk_gb]').val()=="") ||
     		 (this.$('input[name=eph_gb]').val()=="") ||
     		 (this.$('input[name=flavor_id]').val()<=0) ||
     		 (this.$('input[name=vcpus]').val()<=0) ||
     		 (this.$('input[name=memory_mb]').val()<=0) ||
     		 (this.$('input[name=disk_gb]').val()<=0) ||
     		 (this.$('input[name=eph_gb]').val()<=0) ||
     		 (this.$('input[name=flavor_id]').val()%1!=0) ||
     		 (this.$('input[name=vcpus]').val()%1!=0) ||
     		 (this.$('input[name=memory_mb]').val()%1!=0) ||
     		 (this.$('input[name=disk_gb]').val()%1!=0) ||
     		 (this.$('input[name=eph_gb]').val()%1!=0)      		 
     		 )
     	{
     		console.log("Wrong values entered, no flavor is created");
     		return;
     	} else {
     
        var new_flavor = new Flavor();
        
        new_flavor.set({'flavor_id': this.$('input[name=flavor_id]').val()});
        new_flavor.set({'name': this.$('input[name=name]').val()});
        new_flavor.set({'vcpus': this.$('input[name=vcpus]').val()});
        new_flavor.set({'memory_mb': this.$('input[name=memory_mb]').val()});
        new_flavor.set({'disk_gb': this.$('input[name=disk_gb]').val()});
        new_flavor.set({'eph_gb': this.$('input[name=eph_gb]').val()});
            
    	new_flavor.save();
    	}
    	
    	$('#create_flavor').remove();
        $('.modal-backdrop').remove();

    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_flavor').remove();
        $('.modal-backdrop').remove();
    },
   
});