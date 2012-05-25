var CreateSnapshotView = Backbone.View.extend({
    
    _template: _.itemplate($('#createSnapshotFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'update',
      'click .modal-backdrop': 'close'   
    },
    
    initialize: function() {
    },
    
    render: function () {
        console.log("Creating snapshot");
        if ($('#create_snapshot').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        console.log("Closing create shapshot");
        $('#create_snapshot').remove();
        $('.modal-backdrop').remove();
    },
    
    update: function(e) {
        console.log("Starting create snapshot");
        var name = $('input[name=snapshot_name]').val();
        this.model.createsnapshot(name); 
        this.close();
    }
    
});