var CreateVDCServiceView = Backbone.View.extend({

    _template: _.itemplate($('#createVDCServiceFormTemplate').html()),

    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close-service': 'close',
        'click .modal-backdrop:last': 'close',
        'click #addInstance': 'addInstance'
    },
    
    addInstance: function() {
        console.log('Showing Instance Creation');
        var subview = new LaunchImageView({el: 'body', model: {}, images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs});
        subview.render();
    },
    
    close: function(e) {
        e.preventDefault();
        console.log("Removing Create VDC");
        $('#create_service').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_service').html() != null) {
            $('#create_service').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({instances: []}));
        $('#create_service').modal();
        return this;
    },
    
    onSubmit: function(e){
        e.preventDefault();         
        //Check if the fields are not empty, and the numbers are not negative nor decimal
        this.close();
        if (this.$('input[name=name]').val()=="") { 
          var subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for service. Please try again."});     
          subview.render(); 
          return;
        } else {
            var newService = new VDCService();        
            newService.set({'name': this.$('input[name=name]').val()});
            //newService.save();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Service " + newService.get('name') + " created."});     
            subview.render();
        }       
    }
           
});