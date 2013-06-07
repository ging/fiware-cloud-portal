var CreateBlueprintView = Backbone.View.extend({

    _template: _.itemplate($('#createBlueprintFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close'
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();
    },

    close: function(e) {
        $('#create_blueprint').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_blueprint').html() != null) {
            $('#create_blueprint').remove();
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
        var callbacks = UTILS.Messages.getCallbacks("Blueprint "+name + " created.", "Error creating blueprint "+name, {context: self});
        var bp = new BPTemplate();
        bp.set({'name': name});
        bp.set({'description': descr});
        bp.save(undefined, callbacks);
    }
});