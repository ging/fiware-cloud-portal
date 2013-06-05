var UploadObjectView = Backbone.View.extend({

    _template: _.itemplate($('#uploadObjectFormTemplate').html()),

    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#upload_object').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#upload_object').html() != null) {
            $('#upload_object').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onSubmit: function(e){
        e.preventDefault();
        var self = this;
        var contName, objName, obj, subview;
        if (this.$('input[name=objName]').val() === "") {
            //this.close();
          subview = new MessagesView({state: "Error", title: "Wrong input values for container. Please try again."});
          subview.render();
          this.close();
          return;
        } else {
            contName = self.model.get("name");
            objName = self.$('input[name=objName]').val();
            obj = document.getElementById("id_object_file").files[0];
            self.model.uploadObject(objName, obj);
            subview = new MessagesView({state: "Success", title: "Object " + objName + " uploaded."});
            subview.render();
            this.close();
        }
    }

});