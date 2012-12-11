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
    	console.log(this.model);
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    downloadKeypair: function() {
    	console.log("downlaod");
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

    
});