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
        if ($('#id_public:checked').length === 1) {
            this.model.set({"visibility": "public"});
        } else {
            this.model.set({"visibility": "private"});
        }
        this.model.save(undefined, UTILS.Messages.getCallbacks("Image "+this.model.get("name") + " updated", "Error updating image "+this.model.get("name"), {context: this}));
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