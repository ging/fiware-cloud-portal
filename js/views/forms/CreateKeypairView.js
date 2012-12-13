var CreateKeypairView = Backbone.View.extend({
    
    _template: _.itemplate($('#createKeypairFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'create',
      'click .modal-backdrop': 'close',         
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
    
    create: function(e) {
    	self = this;   		
        var name = $('input[name=name]').val();
        for (var index in self.model.models) {
        	if (self.model.models[index].attributes.name === name) {        		
        		var subview = new MessagesView({el: '#content', state: "Error", title: "Keypair "+name+" already exists. Please try again."});     
              	subview.render();     
              	return;
	     	} 
	    } 	
		var newKeypair = new Keypair();   
		
		newKeypair.set({'name': name}); 		
        
        window.location.href = '#nova/access_and_security/keypairs/'+name+'/download/';	 
        self.close();           
    }
    
});