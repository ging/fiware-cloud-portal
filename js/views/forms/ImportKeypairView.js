var ImportKeypairView = Backbone.View.extend({
    
    _template: _.itemplate($('#importKeypairFormTemplate').html()),

    events: {
      'click #cancelImportBtn': 'close',
      'click #close': 'close',
      'click #importBtn': 'create',
      'click .modal-backdrop': 'close',         
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        //this.model.unbind("change", this.render, this);
        $('#import_keypair').remove();
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
        var publicKey = $('input[name=public_key]').val();
        var newKeypair = new Keypair();   
        for (var index in self.model.models) {
        	if (self.model.models[index].attributes.name === name) {        		
        		var subview = new MessagesView({el: '#content', state: "Error", title: "Keypair "+name+" already exists. Please try again."});     
              	subview.render(); 
              	return;
	     	} 
	    } 	
        newKeypair.set({'name': name, 'public_key': publicKey});     
        newKeypair.save();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Keypair "+name+" imported."});     
        subview.render();
        this.close();
    }
    
});