var ImportKeypairView = Backbone.View.extend({

    _template: _.itemplate($('#importKeypairFormTemplate').html()),

    events: {
      'click #cancelImportBtn': 'close',
      'click #close': 'close',
      'click #importBtn': 'importKeypair',
      'click .modal-backdrop': 'close'
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        //this.model.unbind("change", this.render, this);
        $('#import_keypair').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    importKeypair: function(e) {
        self = this;
        var name = $('input[name=name]').val();
        var publicKey = $('input[name=public_key]').val();
        var newKeypair = new Keypair();
        var subview;
        for (var index in self.model.models) {
            if (self.model.models[index].attributes.name === name) {
                subview = new MessagesView({state: "Error", title: "Keypair "+name+" already exists. Please try again."});
                subview.render();
                return;
            }
        }
        newKeypair.set({'name': name, 'public_key': publicKey});
        newKeypair.save(undefined, UTILS.Messages.getCallbacks("Keypair "+ name + " imported.", "Error importing keypair "+ name));

        this.close();
    }

});