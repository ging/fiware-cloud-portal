var CopyObjectView = Backbone.View.extend({

    _template: _.itemplate($('#copyObjectFormTemplate').html()),
    
    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },
    
    close: function(e) {
        $('#create_container').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
    	/*for (var index in this.options.get("objects")) {
        	 if (this.model.get("objects")[index].name === evt.target.value) {
        	 	this.model.object = this.model.get("objects")[index]; 
        	 	console.log(this.model.object);
        	 }        	 
        };  */
        if ($('#create_container').html() != null) {
            $('#create_container').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model: this.model, title: this.options.title, container: this.containerName, model: this.options}));
        $('.modal:last').modal();
        return this;
    },
    
    onSubmit: function(e){
        e.preventDefault();  
		var self = this;   
		var containerName, objectName;
        //Check if the fields are not empty, and the numbers are not negative nor decimal
        //this.close();
        if (this.$('input[name=objName]').val() === undefined) {  
          var subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for container. Please try again."});     
          subview.render(); 
          return;
        } else {
        	//console.log(e.target.value);
        	containerName = this.$("#container_switcher option:selected").val();        	
        	if (e.target.value === undefined || e.target.value === "") {
        		objectName = this.$('input[name=objName]').val();
        	} else {
        		objectName = e.target.value;
        	}
            var subview = new MessagesView({el: '#content', state: "Success", title: "Object " + objectName + " copied to conatainer " + containerName});     
            subview.render();
        }   
        self.model.copyObject(objectName,containerName);    
    },
           
});
