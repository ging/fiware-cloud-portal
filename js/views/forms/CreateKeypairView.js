var CreateKeypairView = Backbone.View.extend({
    
    _template: _.itemplate($('#createKeypairFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'create',
      'click .modal-backdrop': 'close',  
      'click #name': 'showTooltipName',
             
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
       
        return this;
    },
    
    close: function(e) {
       	$('#create_keypair').remove();
       	$('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },
    
    showTooltipName: function() {
    	$('#name').tooltip('show');
    },
    
    create: function(e) {
    	e.preventDefault();
    	self = this;   		
    	var namePattern = /^[a-z0-9_-]{1,87}$/;
        var name = $('input[name=name]').val();
        var nameOK;
              
        namePattern.test(name) ? nameOK = true : nameOK = false;
        
        if (nameOK) {        	
	        for (var index in self.model.models) {
	        	if (self.model.models[index].attributes.name === name) {        		
	        		var subview = new MessagesView({el: '#content', state: "Error", title: "Keypair "+name+" already exists. Please try again."});     
	              	subview.render();     
	              	return;
		     	} 
		    } 	
  
        window.location.href = '#nova/access_and_security/keypairs/'+name+'/download/';	 
        } else {
  			var subview = new MessagesView({el: '#content', state: "Error", title: "Wrong values for Keypair. Please try again."});     
           	subview.render();	  			
  		}           
  		
        self.close();           
    }
    
});