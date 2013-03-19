var NovaKeypairsView = Backbone.View.extend({

    _template: _.itemplate($('#novaKeypairsTemplate').html()),

    initialize: function() {

        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events: {
        'change .checkbox_keypairs':'enableDisableDeleteButton',
        'click #delete_keypair': 'deleteKeypair',
        'click #delete_keypairs': 'deleteKeypairs',
        'click .btn-create': 'createKeypair',
        'click .btn-import': 'importKeypair'
    },

    onClose: function() {
        this.model.unbind("reset", this.render, this);
        this.unbind();
        this.undelegateEvents();
    },

    deleteKeypair: function (e) {
        var keypair =  this.model.get(e.target.value);
        var subview = new ConfirmView({el: 'body', title: "Delete Keypair", btn_message: "Delete Keypair", onAccept: function() {
            keypair.destroy();
            var subview2 = new MessagesView({el: '#content', state: "Success", title: "Keypair "+e.target.value+" deleted."});
            subview2.render();
        }});
        subview.render();


    },

    deleteKeypairs: function (e) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Keypairs", btn_message: "Delete Keypairs", onAccept: function() {
            $(".checkbox_keypairs:checked").each(function () {
                    var keyPair = $(this).val();
                    var keypair = self.model.get(keyPair);
                    keypair.destroy();
                    var subview2 = new MessagesView({el: '#content', state: "Success", title: "Keypairs "+keyPair+" deleted."});
                    subview2.render();
            });
        }});
        subview.render();
    },

    createKeypair: function() {
        var subview = new CreateKeypairView({el: 'body', model: this.model});
        subview.render();
    },

    importKeypair: function() {
        var subview = new ImportKeypairView({el: 'body',  model: this.model});
        subview.render();
    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_keypairs:checked").size() > 0) {
            $("#delete_keypairs").attr("disabled", false);
        } else {
            $("#delete_keypairs").attr("disabled", true);
        }

    },

    renderFirst: function() {
        this.undelegateEvents();
        var that = this;
        UTILS.Render.animateRender(this.el, this._template, {models: this.model.models}, function() {
            that.enableDisableDeleteButton();
            that.delegateEvents(that.events);
        });
    },

    render: function () {
        this.undelegateEvents();
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#keypairs").html() != null) {
            var new_template = this._template({models: this.model.models});
            var checkboxes = [];
            var index, keypairsName, check;
            for (index in this.model.models) {
                keypairsName = this.model.models[index].id;
                if ($("#checkbox_keypairs_"+keypairsName).is(':checked')) {
                    checkboxes.push(keypairsName);
                }
            }
            var scrollTo = $(".scrollable").scrollTop();
            $(this.el).html(new_template);
            $(".scrollable").scrollTop(scrollTo);
            for (index in checkboxes) {
                keypairsName = checkboxes[index];
                check = $("#checkbox_keypairs_"+keypairsName);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            this.enableDisableDeleteButton();
        }
        this.delegateEvents(this.events);

        return this;
    }
});