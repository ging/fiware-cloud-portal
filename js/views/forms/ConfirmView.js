var ConfirmView = Backbone.View.extend({

    _template: _.itemplate($('#confirmTemplate').html()),

    initialize: function() {
        this.delegateEvents({
            'click #confirm_btn': 'onAccept',
            'click #cancelBtn': 'close',
            'click #closeModalConfirm': 'close',
            'click .modal-backdrop': 'close'
        });
        this.options.title = this.options.title || "Are you sure?";
        this.options.message = this.options.message || "Please confirm your selection. This action cannot be undone.";
        this.options.btn_message = this.options.btn_message || "Confirm";
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        $('#confirm').remove();
    },

    render: function () {
        if ($('#confirm').html() != null) {
            $('#confirm').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({title:this.options.title, message:this.options.message, btn_message: this.options.btn_message, style: this.options.style}));

        $('.modal:last').modal();
        $('.modal:last').css('z-index', '105011');
        $(".modal-backdrop:last").css('z-index', '105010');

        return this;
    },

    onAccept: function(e){
        console.log("Accepted");
        this.close();
        this.options.onAccept();
    },

    close: function(e) {
        this.onClose();
    }

});