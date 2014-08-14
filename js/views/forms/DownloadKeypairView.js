var DownloadKeypairView = Backbone.View.extend({

    _template: _.itemplate($('#downloadKeypairFormTemplate').html()),
    blob: undefined,
    blobURL: undefined,
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
        var self = this;
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
        };
        var callbacks = UTILS.Messages.getCallbacks("Keypair " + name + " created.", "Error creating keypair", {success: mySuccess});
        this.model.save(undefined, callbacks);
    }
});
