var CreateUserView = Backbone.View.extend({

    _template: _.itemplate($('#createUserFormTemplate').html()),

    events: {
        'click .create-user': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#create_user').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_user').html() != null) {
            $('#create_user').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onCreate: function(e){
    }

});