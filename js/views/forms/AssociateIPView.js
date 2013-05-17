var AssociateIPView = Backbone.View.extend({

    _template: _.itemplate($('#associateIPFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'submit #form': 'allocate',
      'click .modal-backdrop': 'close'
    },

    render: function () {
        $(this.el).append(this._template({model:this.model, instances: this.options.instances}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#associate_IP').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    allocate: function(e) {
        self = this;
        var instance_id = this.$("#instance_switcher option:selected").val();            
        if (instance_id !== "") {
            var inst = self.options.instances.get(instance_id); 
            var instance = inst.get("name");
            self.model.associate(instance_id, UTILS.Messages.getCallbacks("Successfully associated Floating IP " +this.options.ip+ " with Instance: " +instance));
            self.close();
        }        
    }   

});