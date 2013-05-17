var EditBlueprintView = Backbone.View.extend({

    _template: _.itemplate($('#editBlueprintFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();
    },

    close: function(e) {
        $('#edit_blueprint').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_blueprint').html() != null) {
            $('#edit_blueprint').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onCreate: function(e){
        var self = this;
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var callbacks = UTILS.Messages.getCallbacks("Blueprint "+name + " updated.", "Error editing blueprint "+name);
        //blueprint.save(undefined, callbacks);
    }
});