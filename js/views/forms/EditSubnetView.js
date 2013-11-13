var EditSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#editSubnetFormTemplate').html()),

    events: {
        'click .update-subnet': 'onUpdate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#edit_subnet').remove();
        $('.edit-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        console.log(this.model);
        if ($('#edit_subnet').html() != null) {
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
        this.model.attributes.set({'name': name});
        this.model.set({'admin_state_up': admin_state});
        this.model.save(undefined, UTILS.Messages.getCallbacks("Subnet "+ name + " was successfully updated.", "Error updating subnet "+ name, {context: this}));
    }

});