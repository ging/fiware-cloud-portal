var CreateVolumeView = Backbone.View.extend({

    _template: _.itemplate($('#createVolumeFormTemplate').html()),

    events: {
          'submit #form': 'create',
          'click #cancelBtn': 'close',
          'click #close': 'close',
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
        e.preventDefault();
        var name = $('input[name=name]').val();
        var description = $('textarea[name=description]').val();
        var size= $('input[name=size]').val();
        this.model = new Volume();
        this.model.set({name: name, description: description, size: size});
        this.model.save();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Volume "+name+" created."});
        subview.render();
        this.close();
    }

});