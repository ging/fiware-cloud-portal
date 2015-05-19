var DownloadOpenrcView = Backbone.View.extend({

    _template: _.itemplate($('#downloadOpenrcFormTemplate').html()),

    events: {
        'submit #download_openrc_form': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#download_openrc').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#download_openrc').html() != null) {
            $('#download_openrc').remove();
            $('.modal-backdrop').remove();
        }
        var tenant = UTILS.Auth.getCurrentTenant();

        $(this.el).append(this._template({  username: UTILS.Auth.getName(),
                                            tenant_name: tenant.name,
                                            tenant_id: tenant.id,
                                            current_region: UTILS.Auth.getCurrentRegion()
        }));
        console.log(UTILS.Auth.getCurrentTenant());
        $('.modal:last').modal();
        return this;
    },

    onSubmit: function(e){
        e.preventDefault();
        var subview;

        subview = new MessagesView({state: "Success", title: "Openrc file downloaded"});
        subview.render();

        console.log("Closing...");
        this.close();
    }

});