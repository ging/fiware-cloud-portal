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

        if ((this.$('input[name=name]').val() === "")||(this.$('input[name=name]').val() === undefined)) {
          subview = new MessagesView({state: "Error", title: "Wrong input values for container. Please try again."});
          subview.render();
          this.close();
          return;
        } else {
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
            newContainer.save();
            subview = new MessagesView({state: "Success", title: "Container " + newContainer.get('name') + " created."});
            subview.render();
            this.close();
        }
        this.close();
    }

});