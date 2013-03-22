var ModifyQuotasView = Backbone.View.extend({

    _template: _.itemplate($('#modifyQuotasFormTemplate').html()),

    events: {
        'click .update-quota': 'onUpdate',
        'click #cancelBtn': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#modify_quota').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        console.log(this.model);
        if ($('#modify_quota').html() != null) {
            $('#modify_quota').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model, project: this.options.project}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var metadata_items = this.$('input[name=metadata_items]').val();
        var injected_files = this.$('input[name=injected_files]').val();
        var injected_file_content_bytes = this.$('input[name=injected_file_content_bytes]').val();
        var cores = this.$('input[name=cores]').val();
        var instances = this.$('input[name=instances]').val();
        var volumes = this.$('input[name=volumes]').val();
        var gigabytes = this.$('input[name=gigabytes]').val();
        var ram = this.$('input[name=ram]').val();
        var floating_ips = this.$('input[name=floating_ips]').val();

        this.model.set({'metadata_items': metadata_items});
        this.model.set({'injected_files': injected_files});
        this.model.set({'injected_file_content_bytes': injected_file_content_bytes});
        this.model.set({'cores': cores});
        this.model.set({'instances': instances});
        this.model.set({'volumes': volumes});
        this.model.set({'gigabytes': gigabytes});
        this.model.set({'ram': ram});
        this.model.set({'floating_ips': floating_ips});

        this.model.save();
        subview = new MessagesView({el: '#content', state: "Success", title: "Quota updated"});
        subview.render();
        this.close();
    }

});