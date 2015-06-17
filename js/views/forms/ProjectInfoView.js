var DownloadOpenrcView = Backbone.View.extend({

    _template: _.itemplate($('#projectInfoFormTemplate').html()),

    events: {
        'submit #project_info_form': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#project_info').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#project_info').html() != null) {
            $('#project_info').remove();
            $('.modal-backdrop').remove();
        }

        var name = UTILS.Auth.getName();
        var tenant = UTILS.Auth.getCurrentTenant();
        var region = UTILS.Auth.getCurrentRegion();
        var url = JSTACK.Keystone.params.adminUrl;

        console.log('admincURL: ', url);
        console.log('other url: ', JSTACK.Keystone.params.url);

        $(this.el).append(this._template({  username: name,
                                            tenant_name: tenant.name,
                                            tenant_id: tenant.id,
                                            current_region: region,
                                            auth_url: url

        }));
        //console.log(UTILS.Auth.getCurrentTenant());
        $('.modal:last').modal();
        return this;
    },

    onSubmit: function(e){
        e.preventDefault();
        var subview, name, tenant, region, url, blob, filename;
        
        name = UTILS.Auth.getName();
        tenant = UTILS.Auth.getCurrentTenant();
        region = UTILS.Auth.getCurrentRegion();
        url = JSTACK.Keystone.params.adminUrl;
        openrc = [];

        openrc.push('export OS_USERNAME=' + name + '\n');
        openrc.push('export OS_PASSWORD= \n');
        openrc.push('export OS_TENANT_NAME=' + tenant.name + '\n');
        openrc.push('export OS_REGION_NAME=' + region + '\n');
        openrc.push('export OS_AUTH_URL=' + url);

        filename = name + '-openrc';

        blob = new Blob(openrc, {type: 'text/plain'});

        saveAs(blob, filename);

        subview = new MessagesView({state: "Success", title: "Openrc file downloaded"});
        subview.render();

        console.log("Closing...");
        this.close();
    }

});