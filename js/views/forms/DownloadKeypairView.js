var DownloadKeypairView = Backbone.View.extend({
    
    _template: _.itemplate($('#downloadKeypairFormTemplate').html()),

	initialize: function() {	
    	this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
    },
    
    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close'
     // 'click .downloadKeypair': 'downloadKeypair'        
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
			var privateKey = object.keypair.private_key;
			var blob, blobURL;
        	var blob = new Blob([privateKey], { type: "application/x-pem-file" });
			var blobURL = window.URL.createObjectURL(blob);
			
			//window.open(blobURL, 'Save Keypair','width=0,height=0');
			//$('#createKeypairFormTemplate').('#createBtn').attr("href", blobURL);
			//$('#createKeypairFormTemplate').('#createBtn').attr("download", name+'.pem');
			//$('#createKeypairFormTemplate').load(blobURL).dialog('open');
			
			$('.downloadKeypair').append("Download Keypair");
			$('.downloadKeypair').attr("href", blobURL);
			$('.downloadKeypair').attr("download", name+'.pem');
		
			return false;

			var subview = new MessagesView({el: '#content', state: "Success", title: "Keypair "+name+" created."});     
	   		subview.render();      		
        }; 
        JSTACK.Nova.createkeypair(name, undefined, mySuccess); 
    },
    
    downloadKeypair: function() {
    	self = this;
    	console.log();
    	var blobURL = localStorage.getItem('blobURL');
    	window.open(blobURL, 'Download Keypair','width=0,height=0');   
    	
    	//
    	//window.URL = window.webkitURL || window.URL;
		//window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
		//var blob = new Blob([privateKey], { type: "application/x-pem-file" });
		//var blobURL = localStorage.getItem('blobURL');
		
		//$(".downloadKeypair").attr("href", blobURL);
		//$(".downloadKeypair").attr("download", '.pem');
		 //document.appendChild(".downloadKeypair");
		//document.body.appendChild(a);

    	
    	//
			
			
			 	
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