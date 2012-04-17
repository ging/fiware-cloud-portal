var DeleteFlavorView = Backbone.View.extend({
    
    _template: _.template($('#deleteFlavorFormTemplate').html()),
    
   	initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();

    },
    
    events: {
        'click #flavor_delete': 'onDeleteFlavor',
        'click #cancelBtn': 'close',
      	'click #close': 'close',
    },
    
   	render: function () {
        console.log("Rendering delete flavor");
        console.log("HTML = "+$('#delete_flavor').html());
        if ($('#delete_flavor').html() != null) {        	
            //return;
            $('#delete_flavor').remove();
        	$('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
        
    },
    
    onDeleteFlavor: function(e){
       	e.preventDefault();   
       	console.log("Flavor to delete = "+this.model.get("id"));
		console.log(this.model);                    
       	this.model.destroy();   
       	$('#delete_flavor').remove();
        $('.modal-backdrop').remove();  
    },		
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#delete_flavor').remove();
        $('.modal-backdrop').remove();
    },
   
});