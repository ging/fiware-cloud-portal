var UpdateInstanceView = Backbone.View.extend({

    _template: _.itemplate($('#updateInstanceFormTemplate').html()),

    events: {
        'submit #update_instance_form': 'update',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#update_instance').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#update_instance').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    update: function(e) {
        e.preventDefault();
        this.model.set({"name": this.$('input[name=name]').val()});
        var newName = $('input[name=name]').val();
        this.model.save(undefined, UTILS.Messages.getCallbacks("Instance "+ newName + " updated", "Error updating instance "+ newName, {context: this}));
    }

});