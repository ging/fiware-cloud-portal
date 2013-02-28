var EditProjectView = Backbone.View.extend({

    _template: _.itemplate($('#editProjectFormTemplate').html()),

    events: {
        'click .update-project': 'onUpdate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#edit_project').remove();
        $('.edit-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_project').html() != null) {
            $('#edit_project').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
    }

});