var CreateVolumeSnapshotView = Backbone.View.extend({

    _template: _.itemplate($('#createVolumeSnapshotFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'create',
      'click .modal-backdrop': 'close'
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    initialize: function() {
    },

    render: function () {
        if ($('#create_volume_modal').html() != null) {
            return;
        }
        $(this.el).append(this._template());
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#create_volume_snapshot_modal').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    create: function(e) {
        var name = $('input[name=name]').val();
        var description = $('textarea[name=description]').val();
        var snapshot = new VolumeSnapshot();
        //this.options.volumeSnapshotsModel = new VolumeSnapshot();
        snapshot.set({volume_id: this.model.id, name: name, description: description});
        snapshot.save(undefined, UTILS.Messages.getCallbacks("Volume snapshot "+ name + " created.", "Error creating volume snapshot "+ name, {context: this}));
    }

});