var CreateSnapshotView = Backbone.View.extend({

    _template: _.itemplate($('#createSnapshotFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'submit #form': 'update',
      'click .modal-backdrop': 'close'
    },

    initialize: function() {
    },

    render: function () {
        if ($('#create_snapshot').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_snapshot').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    update: function(e) {
        var name = $('input[name=snapshot_name]').val();
        this.model.createimage(name, UTILS.Messages.getCallbacks("Snapshot "+ name + " created", "Error creating snapshot " + name, {context: this}));
    }

});