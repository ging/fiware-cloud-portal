var AllocateIPView = Backbone.View.extend({

    _template: _.itemplate($('#allocateIPFormTemplate').html()),

    events: {
      'click #cancelCreateBtn': 'close',
      'click #close': 'close',
      'submit #form': 'create',
      'click .modal-backdrop': 'close'
    },

    render: function () {
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        //this.model.unbind("change", this.render, this);
        $('#create_keypair').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    create: function(e) {
        self = this;
        var name = $('input[name=name]').val();


        subview = new MessagesView({el: '#content', state: "Success", title: "IP allocated."});
        subview.render();
        self.close();
    }

});