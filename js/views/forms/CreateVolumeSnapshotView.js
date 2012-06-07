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
        $('#create_volume_modal').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },
    
    create: function(e) {
    	var id= $('input[name=id]').val();
        var name = $('input[name=name]').val();
        var description = $('textarea[name=description]').val();
        this.model = new VolumeSnapshot();
        //this.options.volumeSnapshotsModel = new VolumeSnapshot();
        this.model.set({cid: id, name: name, description: description});
        console.log(this.model);
        this.model.save();
        console.log("VOL SNAP ID = "+this.model.get("cid"));
        console.log("VOL SNAP name = "+this.model.get("name"));
        console.log("VOL SNAP desc = "+this.model.get("description"));
        var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume snapshot "+name+" created."});     
        subview.render();
        this.close();
    }
    
});