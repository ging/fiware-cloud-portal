var MessagesView = Backbone.View.extend({

    _template: _.template($('#messagesTemplate').html()),

    el: "#logs",

    initialize: function() {
        this.options.state = this.options.state || "Success";
    },

    close: function() {
        $('.messages').remove();
    },

    render: function () {
        var self = this;
        $(this.el).before(this._template({title:this.options.title, state:this.options.state}));
        $('.messages').fadeOut(4000, function() {
            self.close();
        });
        return this;
    }

});