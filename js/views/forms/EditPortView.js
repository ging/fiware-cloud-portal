var EditPortView = Backbone.View.extend({

    _template: _.itemplate($('#editPortFormTemplate').html()),

    events: {
        'click .update-port': 'onUpdate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#edit_port').remove();
        $('.edit-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_port').html() != null) {
            $('#edit_port').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model.attributes}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var name = this.$('input[name=name]').val();
        var admin_state = this.$('input[name=admin_state]').is(':checked');
        this.model.set({'name': name});
        this.model.set({'admin_state_up': admin_state});
        this.model.save(undefined, {success: function(model, response) {
        UTILS.Messages.getCallbacks("Port "+ name + " was successfully updated.", "Error updating port "+ name, {context: this});
        this.model.bind("sync", this.render, this);
        }, error: function(response) {
            console.log("error", response);
        }});  
        this.close();  
    }

});