var AllocateIPView = Backbone.View.extend({

    _template: _.itemplate($('#allocateIPFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'submit #form': 'allocate',
      'click .modal-backdrop': 'close'
    },

    render: function () {
        $(this.el).append(this._template({pools: this.options.pools}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#allocate_IP').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    allocate: function(e) {
        self = this;
        var pool = this.$("#pool_switcher option:selected").val();
        var newIP = new FloatingIP();
        newIP.allocate(pool, UTILS.Messages.getCallbacks("Successfully allocated floating IP"));
        self.close();
    }

});