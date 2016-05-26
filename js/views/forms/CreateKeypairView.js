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
            var mySuccess = function(model) {
                var privateKey = model.get('private_key');
                self.blob = new Blob([privateKey], { type: "application/x-pem-file" });
                self.blobURL = window.URL.createObjectURL(self.blob);

                //window.open(blobURL, 'Save Keypair','width=0,height=0');

                $('.downloadKeypair').append("Download Keypair");
                $('.downloadKeypair').attr("href", self.blobURL);
                $('.downloadKeypair').attr("download", name + '.pem');
                $('.downloadKeypair').on("click", function() {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(self.blob, name + ".pem");
                    }
                });
                if (self.options.callback !== undefined) {
                    self.options.callback(model);
                }    
            };
            var callbacks = UTILS.Messages.getCallbacks("Keypair " + name + " created.", "Error creating keypair", {success: mySuccess});
            var keypair = new Keypair();
            keypair.set({'name': name});
            keypair.save(undefined, callbacks);

        } else {
            subview = new MessagesView({state: "Error", title: "Wrong values for Keypair. Please try again."});
            subview.render();
        }

        $('#createBtn1').hide();
        $('#cancelBtn1').text('Close');
    }
});