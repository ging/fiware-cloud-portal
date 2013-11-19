var EditRouterView = Backbone.View.extend({

    _template: _.itemplate($('#editRouterFormTemplate').html()),

    events: {
      'click #cancelBtn-router': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'click #update_router_button': 'onUpdate'
    },

    initialize: function() {
    },

    render: function () {
        if ($('#edit_router').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, networks: this.options.networks}));
        $('#edit_router').modal();
        return this;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        $('#edit_router').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    onUpdate: function(e) {
        var external_network_id = $('#external_network option:selected').val();
        if (external_network_id !== "") {
            this.model.set({'external_gateway_info:network_id': external_network_id});
            this.model.save(undefined, UTILS.Messages.getCallbacks("Gateway interface is added.", "Failed to set gateway to router "), {context: this}); 
            this.close();
        }         
    }
});