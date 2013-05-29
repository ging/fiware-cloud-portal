var CreateBlueprintInstanceView = Backbone.View.extend({

    _template: _.itemplate($('#createBlueprintInstanceFormTemplate').html()),

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
        $('#create_blueprint_instance').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_blueprint_instance').html() != null) {
            $('#create_blueprint_instance').remove();
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
        var callbacks = UTILS.Messages.getCallbacks("Blueprint "+name + " launched.", "Error launching blueprint "+name, {context: self});

        var bp = this.model;
        var bpi = new BPInstance();
        bpi.set({"name": name});
        bpi.set({"description": descr});
        bpi.set({"tierDtos": bp.get("tierDtos_asArray")});
        bpi.save(undefined, callbacks);

        window.location.href = "#nova/blueprints/instances/";
    }
});