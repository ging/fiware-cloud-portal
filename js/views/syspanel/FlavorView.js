var FlavorView = Backbone.View.extend({

    _template: _.itemplate($('#flavorsTemplate').html()),


    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events: {
        'change .checkbox':'enableDisableDeleteButton',
        'click .btn-delete':'onDelete',
        'click .btn-delete-group':'onDeleteGroup'
    },

    onClose: function() {
        this.model.unbind("reset");
        this.undelegateEvents();
        this.unbind();
    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox:checked").size() > 0) {
            $("#flavors_delete").attr("disabled", false);
        } else {
            $("#flavors_delete").attr("disabled", true);
        }

    },

    onDelete: function(evt) {
        var flavor = evt.target.value;
        var flav = this.model.get(flavor);
        console.log(flav);
        var subview = new ConfirmView({el: 'body', title: "Delete Flavor", btn_message: "Delete Flavor", onAccept: function() {
            flav.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Flavor "+flav.get("name")+" deleted."});
            subview.render();
        }});
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Flavors", btn_message: "Delete Flavor", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var flavor = $(this).val();
                    var flav = self.model.get(flavor);
                    console.log(flav);
                    flav.destroy();
                    var subview2 = new MessagesView({el: '#content', state: "Success", title: "Flavors "+flav.get("name")+" deleted."});
                    subview2.render();
            });
        }});
        subview.render();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.enableDisableDeleteButton();
    },

    render: function () {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#flavors").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var index, flavorId, check;
            for (index in this.model.models) {
                flavorId = this.model.models[index].id;
                if ($("#checkbox_"+flavorId).is(':checked')) {
                    checkboxes.push(flavorId);
                }
            }
            $(this.el).html(new_template);
            for (index in checkboxes) {
                flavorId = checkboxes[index];
                check = $("#checkbox_"+flavorId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            this.enableDisableDeleteButton();
        }

        return this;
    }

});