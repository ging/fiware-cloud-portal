var AddInterfaceToRouterView = Backbone.View.extend({

    _template: _.itemplate($('#addInterfaceToRouterFormTemplate').html()),

    events: {
      'click #cancelBtn-interface-router': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'click #add_interface_router_button': 'addInterface'
    },

    initialize: function() {
    },

    render: function () {
        if ($('#add_interface_router').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, subnets:this.options.subnets, networks:this.options.networks, tenant_id: this.options.tenant_id}));
        $('#add_interface_router').modal();
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
        $('#add_interface_router').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    addInterface: function(e) {
        var subnet_id = $('#subnet option:selected').val();
        if (subnet_id !== "") {
            this.model.addinterfacetorouter(subnet_id, UTILS.Messages.getCallbacks("Interface added.", "Failed to add interface to router "),  {context: this}); 
            this.close();
        }          
    }
});