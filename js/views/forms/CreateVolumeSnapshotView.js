var CreateVolumeSnapshotView = Backbone.View.extend({
    
    _template: _.itemplate($('#createVolumeSnapshotFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'update',
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
        $('#create_volume_modal').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },
    
    update: function(e) {
    	var size= $('input[name=id]').val();
        var name = $('input[name=name]').val();
        var description = $('textarea[name=description]').val();
        this.options.volumeSnapshotsModel = new VolumeSnapshot();
        this.options.volumeSnapshotsModel.set({id: id, name: name, description: description});
        this.options.volumeSnapshotsModel.save();
        console.log(this.options.volumeSnapshotsModel);
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume snapshot "+name+" created."});     
        subview.render();
        this.close();
    }
    
});