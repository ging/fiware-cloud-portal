var DownloadKeypairView = Backbone.View.extend({

    _template: _.itemplate($('#downloadKeypairFormTemplate').html()),

    initialize: function() {
    },

    events: {
    },

    render: function () {
        $(this.el).html(this._template({model:this.model}));
        this.createKeypair();
        return this;
    },

    createKeypair: function(e) {
        var name = this.model.get('name');
        var mySuccess = function(model) {
            var privateKey = model.get('private_key');
            var blob, blobURL;
            blob = new Blob([privateKey], { type: "application/x-pem-file" });
            blobURL = window.URL.createObjectURL(blob);

            //window.open(blobURL, 'Save Keypair','width=0,height=0');

            $('.downloadKeypair').append("Download Keypair");
            $('.downloadKeypair').attr("href", blobURL);
            $('.downloadKeypair').attr("download", name + '.pem');
        };
        var callbacks = UTILS.Messages.getCallbacks("Keypair " + name + " created.", "Error creating keypair", {success: mySuccess});
        this.model.save(undefined, callbacks);
    }
});