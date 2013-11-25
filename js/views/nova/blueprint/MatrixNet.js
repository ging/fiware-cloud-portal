var MatrixNetView = Backbone.View.extend({

    _template: _.itemplate($('#matrixNetTemplate').html()),


    initialize: function() {
    },

    events: {
    },

    close: function(e) {
        $('#matrix_net').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        if ($('#matrix_net').html() != null) {
            $('#matrix_net').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    }
});