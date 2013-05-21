var CloneBlueprintView = Backbone.View.extend({

    _template: _.itemplate($('#cloneBlueprintFormTemplate').html()),

    events: {
        'submit #form': 'onClone',
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
        $('#clone_blueprint').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#clone_blueprint').html() != null) {
            $('#clone_blueprint').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onClone: function(e){
        var self = this;
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var callbacks = UTILS.Messages.getCallbacks("Blueprint "+name + " cloned.", "Error cloning blueprint "+name, {context: self});
        
        var bp = new BPTemplate();
        bp.set({'name': name});
        bp.set({'description': descr});

        if (this.options.bpTemplate) {
            if (this.options.bpTemplate.tierDto_asArray) {
                bp.set({'tierDto': this.options.bpTemplate.tierDto_asArray});
            }
        } else {
            if (this.model.get("tierDto_asArray")) {
                bp.set({'tierDto': this.model.get("tierDto_asArray")});
            }
        }

        console.log(bp);

        bp.save(undefined, callbacks);
    }
});