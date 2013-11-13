var EditNetworkView = Backbone.View.extend({

    _template: _.itemplate($('#editNetworkFormTemplate').html()),

    events: {
        'click .update-network': 'onUpdate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#edit_network').remove();
        $('.edit-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_network').html() != null) {
            $('#edit_network').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var name = this.$('input[name=name]').val();
        var admin_state = this.$('input[name=admin_state]').is(':checked');
        this.model.set({'name': name});
        this.model.set({'admin_state_up': admin_state});
        this.model.save(undefined, UTILS.Messages.getCallbacks("Network "+ name + " was successfully updated.", "Error updating network "+ name, {context: this}));
    }

});