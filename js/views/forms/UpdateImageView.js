var UpdateImageView = Backbone.View.extend({

    _template: _.itemplate($('#updateImageFormTemplate').html()),

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },

    events: {
        'click #image_update': 'onUpdateImage',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    render: function () {
        if ($('#update_image').html() != null) {
            //return;
            $('#update_image').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;

    },

    onUpdateImage: function(e){
        e.preventDefault();
        this.model.set({"name": this.$('input[name=name]').val()});
        this.model.save();
        var subview = new MessagesView({state: "Success", title: "Image "+this.model.get('name')+" updated."});
        subview.render();
        this.close();
        $('#update_image').remove();
        $('.modal-backdrop').remove();
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#update_image').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    }

});