var DownloadKeypairView = Backbone.View.extend({
    
    _template: _.itemplate($('#downloadKeypairFormTemplate').html()),

	initialize: function() {	
    	this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        //this.renderFirst();
    },
    
    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'click .downloadKeypair': 'downloadKeypair'        
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        this.createKeypair();
        return this;
    },
    
    createKeypair: function(e) {
    	var name = this.model.attributes.name;
    	var mySuccess = function(object) {   	
    		console.log(object.keypair.public_key);
			var privateKey = object.keypair.private_key;
			var blob, blobURL;
        	var blob = new Blob([privateKey], { type: "application/x-pem-file" });
			var blobURL = window.URL.createObjectURL(blob);
			localStorage.setItem('blobURL', blobURL);
			window.open(blobURL, 'Save Keypair','width=0,height=0');
			
			return false;

			var subview = new MessagesView({el: '#content', state: "Success", title: "Keypair "+name+" created."});     
	   		subview.render();      		
        }; 
        JSTACK.Nova.createkeypair(name, undefined, mySuccess); 
    },
    
    downloadKeypair: function() {
    	self = this;
    	var blobURL = localStorage.getItem('blobURL');
    	window.open(blobURL, 'Download Keypair','width=0,height=0');
		return false;    	
    },
    
    close: function(e) {    
    	window.close();    
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    
});