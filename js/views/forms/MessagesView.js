var MessagesView = Backbone.View.extend({

    _template: _.template($('#messagesTemplate').html()),

    el: "#logs",

    events: {
        'click #info': "showInfo"
    },

    initialize: function() {
        this.options.state = this.options.state || "Success";
    },

    safe_tags_replace: function (str) {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return str.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    },

    showInfo: function(evt) {
        var self = this;
        evt.preventDefault();
        evt.stopPropagation();
        var subview = new ConfirmView({el: 'body', title: this.options.title, message: this.safe_tags_replace(this.options.info), btn_message: "Ok", onAccept: function() {
            self.close();
        }});
        subview.render();
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