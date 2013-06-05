var EditVolumeAttachmentsView = Backbone.View.extend({

    _template: _.itemplate($('#editVolumeAttachmentsFormTemplate').html()),

    events: {
      'click .cancelBtn': 'close',
      'click .close': 'close',
      'click .attachBtn': 'attach',
      'click .detachBtn': 'detach',
      'click .checkbox_attachments': 'enableDisableDettachButton',
      'click .modal-backdrop': 'close',
      'click #attachments__action_detach': 'detachGroup'
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    initialize: function() {
    },

    render: function () {
        if ($('#create_volume_modal').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, instancesModel: this.options.instances}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#attach_volume_modal').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    detach: function(evt) {
        var instance = evt.target.value;
        console.log("Detaching " + instance);
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Detach Volume", btn_message: "Detach Volume", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            self.options.instances.get(instance).detachvolume({volume_id: self.model.id});
            var subview2 = new MessagesView({state: "Success", title: "Volume "+name+" detached."});
            subview2.render();
        }});
        subview.render();
        //this.close();
    },

    attach: function(e) {
        var instance = $('select[id=id_instance]').val();
        var device = $('input[name=device]').val();
        this.options.instances.get(instance).attachvolume({volume_id: this.model.id, device:device});
        var subview = new MessagesView({state: "Success", title: "Volume "+name+" attached."});
        subview.render();
        this.close();
    },

    detachGroup: function(evt) {
        var self = this;
        var attachments = $(".checkbox_attachments:checked");
        this.close();
        var subview = new ConfirmView({el: 'body', title: "Detach Volumes", btn_message: "Detach Volumes", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            attachments.each(function () {
                    var instance = $(this).val();
                    var inst = self.options.instances.get(instance);
                    self.options.instances.get(instance).detachvolume({volume_id: self.model.id});
                    var subview2 = new MessagesView({state: "Success", title: "Volumes "+inst.get("name")+" detached."});
                    subview2.render();
            });
        }});
        subview.render();
    },

    enableDisableDettachButton: function () {
        if ($(".checkbox_attachments:checked").size() > 0) {
            $("#attachments__action_detach").attr("disabled", false);
        } else {
            $("#attachments__action_detach").attr("disabled", true);
        }

    }

});