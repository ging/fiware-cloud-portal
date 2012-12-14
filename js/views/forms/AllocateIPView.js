var AllocateIPView = Backbone.View.extend({
    
    _template: _.itemplate($('#allocateIPFormTemplate').html()),

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
        //this.model.unbind("change", this.render, this);
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
				
		mySuccess = function(object) {   	
			var privateKey = object.keypair.private_key;
			var blob, blobURL;
        	var blob = new Blob([privateKey], { type: "application/x-pem-file" });
			var blobURL = window.URL.createObjectURL(blob);		
			window.open(blobURL);
        };              
	   	JSTACK.Nova.createkeypair(name, undefined, mySuccess); 
	  
	   	window.location.href = '#nova/access_and_security/keypairs/'+name+'/download/';

	    var subview = new MessagesView({el: '#content', state: "Success", title: "Keypair "+name+" created."});     
	   	subview.render();
	    self.close();	               
    }
    
});