var CreateVDCServiceView = Backbone.View.extend({

    _template: _.itemplate($('#createVDCServiceFormTemplate').html()),
    instances: new Instances(),

    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close-service': 'close',
        'click .modal-backdrop': 'close',
        'click #addInstance': 'addInstance'
    },

    initialize: function() {
        this.instances = new Instances();
        console.log(this.instances);
    },

    addInstance: function() {
        var self = this;
        console.log('Showing Instance Creation');
        var subview = new LaunchImageView({el: 'body', model: {}, images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, addInstance: function(instance) {
            self.instances.add(instance);
            self.renderSecond();
        }});
        subview.render();
    },

    close: function(e, self) {
        e.preventDefault();
        console.log("Removing Create VDC");
        $('#create_service').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    renderSecond: function() {
        $('#create_service').remove();
        $(this.el).append(this._template({instances: this.instances, flavors: this.options.flavors}));
    },

    render: function () {
        if ($('#create_service').html() !== null) {
            $('#create_service').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({instances: this.instances, flavors: this.options.flavors}));
        $('#create_service').modal();
        return this;
    },

    onSubmit: function(e){
        var subview;
        e.preventDefault();
        //Check if the fields are not empty, and the numbers are not negative nor decimal
        this.close();
        if (this.$('input[name=name]').val()==="") {
          subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for service. Please try again."});
          subview.render();
          return;
        } else {
            var newService = new VDCService();
            newService.set({'name': this.$('input[name=name]').val()});
            //newService.save();
            subview = new MessagesView({el: '#content', state: "Success", title: "Service " + newService.get('name') + " created."});
            subview.render();
        }
    }

});