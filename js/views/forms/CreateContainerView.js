var CreateContainerView = Backbone.View.extend({

    _template: _.itemplate($('#createContainerFormTemplate').html()),

    events: {
        'submit #create_container_form': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#create_container').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_container').html() != null) {
            $('#create_container').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onSubmit: function(e){
        e.preventDefault();
        var subview, index;
        //Check if the field is empty
        console.log("Creating container...");
        if ((this.$('input[name=name]').val() === "")||(this.$('input[name=name]').val() === undefined)) {
          console.log("Error!");
          subview = new MessagesView({state: "Error", title: "Wrong input values for container. Please try again."});
          subview.render();
        } else {
            console.log("Checking if it already exists...");
            for (index in this.model.models) {
                if (this.$('input[name=name]').val() === this.model.models[index].get("id")) {
                    subview = new MessagesView({state: "Error", title: "Container with the same name already exists."});
                    subview.render();
                    this.close();
                    return;
                }
            }
            var newContainer = new Container();
            newContainer.set({'name': this.$('input[name=name]').val()});
            var callbacks = UTILS.Messages.getCallbacks("Container " + newContainer.get('name') + " created.", "Error creating container "+name, {context: this});
            console.log("Saving...");
            newContainer.save(undefined, callbacks);
            console.log("Created!");
        }
        console.log("Closing...");
        this.close();
    }

});