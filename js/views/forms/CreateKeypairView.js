var CreateKeypairView = Backbone.View.extend({

    _template: _.itemplate($('#createKeypairFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'submit #create_keypair_form': 'create',
      'click .modal-backdrop': 'close',
      'click #name': 'showTooltipName'
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        $('.createKeypair').attr("download", '.pem');
        return this;
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#create_keypair').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    showTooltipName: function() {
        $('#name').tooltip('show');
    },

    create: function(e) {
        e.preventDefault();
        self = this;
        var namePattern = /^[A-Za-z0-9_\-]{1,87}$/;
        var name = $('input[name=name]').val();
        var nameOK, subview;

        nameOK = namePattern.test(name);

        if (nameOK) {
            for (var index in self.model.models) {
                if (self.model.models[index].attributes.name === name) {
                    subview = new MessagesView({state: "Error", title: "Keypair "+name+" already exists. Please try again."});
                    subview.render();
                    return;
                }
            }

        window.location.href = '#nova/access_and_security/keypairs/'+name+'/download/';

        } else {
            subview = new MessagesView({state: "Error", title: "Wrong values for Keypair. Please try again."});
            subview.render();
        }

        self.close();
    }

});