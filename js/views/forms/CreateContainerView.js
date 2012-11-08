var CreateContainerView = Backbone.View.extend({

    _template: _.itemplate($('#createContainerFormTemplate').html()),

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
        if ($('#create_container').html() != null) {
            $('#create_container').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    onSubmit: function(e){
        e.preventDefault();      
        //Check if the fields are not empty, and the numbers are not negative nor decimal
        
        if (this.$('input[name=name]').val() === undefined) {  
          var subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for container. Please try again."});     
          subview.render(); 
          this.close();
          return;
        } else {
        	for (index in this.model.models) {
        		if (this.$('input[name=name]').val() === this.model.models[index].get("id")) {
        			var subview = new MessagesView({el: '#content', state: "Error", title: "Container with the same name already exists."});     
          			subview.render(); 
          			this.close();
          			return;	
        		}
        	}	
            var newContainer = new Container();        
            newContainer.set({'name': this.$('input[name=name]').val()});
            newContainer.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Container " + newContainer.get('name') + " created."});     
            subview.render();
            this.close();
        }
        this.close();       
    }
           
});