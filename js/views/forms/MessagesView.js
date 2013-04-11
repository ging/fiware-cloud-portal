var MessagesView = Backbone.View.extend({

    _template: _.template($('#messagesTemplate').html()),

    el: "#logs",

    events: {
        'click #info': "showInfo"
    },

    initialize: function() {
        this.options.state = this.options.state || "Success";
    },

    showInfo: function(evt) {
        var subview = new ConfirmView({el: 'body', title: this.options.title, message: escape(this.options.info), btn_message: "Ok", onAccept: function() {
            this.close();
        }});
        subview.render();
        evt.preventDefault();
        evt.stopPropagation();
    },

    close: function() {
        $('.messages').remove();
    },

    render: function () {
        var self = this;
        $(this.el).append(this._template({title:this.options.title, state:this.options.state}));
        $(this.el).animate({scrollTop: ($('.messages').length-1)*(48)+'px'}, 500);
        /*$('.messages').fadeOut(4000, function() {
            self.close();
        });*/
        return this;
    }

});