var InstanceDetailView = Backbone.View.extend({

    _template: _.itemplate($('#instanceDetailTemplate').html()),

    flavorResp: false,
    imageResp: false,
    vncResp: false,
    logResp: false,
    security_groupsResp: false,

    initialize: function() {
        var self = this;
        this.options = this.options || {};

        this.delegateEvents({
            'click #overviewBtn': "showOverview",
            'click #instance_vnc': 'showVNC',
            'click #instance_logs': 'showLogs',
            'click #instance_software': 'showSoftware',
            'click #installed_software': 'showInstalledSoftware',
            'click #new_software': 'showNewSoftware',
            'click #software__action_install': 'onInstallSoftware',
            'click #software__action_uninstall': 'onUninstallSoftware'
        });

        this.model.bind("change", this.onInstanceDetail, this);
        this.model.fetch();

        var options = {};
        options.callback = function(resp) {
            self.options.vncUrl = resp.console.url;
            self.vncResp = true;
            self.checkAll();
        };
        this.model.vncconsole(options);

        var options3 = {};
        options3.callback = function(resp) {
            self.options.security_groups = resp;
            self.security_groupsResp = true;
            self.checkAll();
        };
        JSTACK.Nova.getsecuritygroupforserver(self.model.id, options3.callback);

        var options2 = {};
        options2.callback = function(resp) {
            self.options.logs = resp.output;
            self.logResp = true;
            self.checkAll();
        };
        this.model.consoleoutput(options2);
    },

    showOverview: function() {
        if (this.options) {
            this.options.subview = "overview";
        }
        $('#instance_details__overview').addClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__software').removeClass('active');
        $('#instance_details__installed_software').removeClass('active');
        $('#instance_details__new_software').removeClass('active');
        $('#overview').addClass('active');
        $('#vnc').removeClass('active');
        $('#log').removeClass('active');
        $('#software').removeClass('active');
        $('#installed_software').removeClass('active');
        $('#new_software').removeClass('active');
    },

    showVNC: function() {
        if (this.options) {
            this.options.subview = "vnc";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__vnc').addClass('active');
        $('#instance_details__software').removeClass('active');
        $('#instance_details__installed_software').removeClass('active');
        $('#instance_details__new_software').removeClass('active');
        $('#overview').removeClass('active');
        $('#log').removeClass('active');
        $('#vnc').addClass('active');
        $('#software').removeClass('active');
        $('#installed_software').removeClass('active');
        $('#new_software').removeClass('active');
    },

    showLogs: function() {
        if (this.options) {
            this.options.subview = "logs";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').addClass('active');
        $('#instance_details__software').removeClass('active');
        $('#instance_details__installed_software').removeClass('active');
        $('#instance_details__new_software').removeClass('active');
        $('#overview').removeClass('active');
        $('#vnc').removeClass('active');
        $('#log').addClass('active');
        $('#software').removeClass('active');
    },

    showSoftware: function() {
        if (this.options) {
            this.options.subview = "software";
            this.options.subsubview = "installed_software";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__software').addClass('active');
        $('#overview').removeClass('active');
        $('#vnc').removeClass('active');
        $('#log').removeClass('active');
        $('#software').addClass('active');
        $('#installed_software').addClass('active');
        $('#new_software').removeClass('active');
        this.showInstalledSoftware();

    },

    showInstalledSoftware: function() {
        if (this.options) {
            this.options.subview = "software";
            this.options.subsubview = "installed_software";
        }
        $('#installed_software').addClass('active');
        $('#instance_details__installed_software').addClass('active');
        $('#new_software').removeClass('active');
        $('#instance_details__new_software').removeClass('active');
    },

    showNewSoftware: function() {
        if (this.options) {
            this.options.subview = "software";
            this.options.subsubview = "new_software";
        }
        $('#installed_software').removeClass('active');
        $('#instance_details__installed_software').removeClass('active');
        $('#new_software').addClass('active');
        $('#instance_details__new_software').addClass('active');
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("change");
        this.options.flavor.unbind("change");
        this.options.image.unbind("change");
    },

    close: function(e) {
        this.undelegateEvents();
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__software').removeClass('active');
        $('#instance_details__installed_software').removeClass('active');
        $('#instance_details__new_software').removeClass('active');
        $('#overview').removeClass('active');
        $('#log').removeClass('active');
        $('#vnc').removeClass('active');
        $('#software').removeClass('active');
        $('#installed_software').removeClass('active');
        $('#new_software').removeClass('active');
        this.onClose();
    },

    onInstanceDetail: function() {
        var self = this;
        this.options.flavor = new Flavor();
        this.options.flavor.set({id: this.model.get("flavor").id});
        this.options.flavor.bind("change", function() {
            self.flavorResp = true;
            self.checkAll();
        }, this);
        this.options.image = new ImageVM();
        this.options.image.set({id: this.model.get("image").id});
        this.options.image.bind("change", function() {
            self.imageResp = true;
            self.checkAll();
        }, this);
        this.options.image.fetch();
        this.options.flavor.fetch();
        this.checkAll();
    },

    onInstallSoftware: function(e) {
        var self = this;
        var software = e.target.value;
        var subview = new InstallSoftwareView({el: 'body', model: this.model.get(software)});
        subview.render();
    },

    onUninstallSoftware: function(e) {
        var subview = new ConfirmView({el: 'body', title: "Uninstall Software", btn_message: "Uninstall Software", onAccept: function() {
            //software.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Software deleted."});
            subview.render();
        }});
        subview.render();
    },


    checkAll: function() {
        var self = this;
        //if (this.flavorResp && this.imageResp && this.vncResp && this.logResp) {
        if (this.flavorResp) {
            this.render();
        }
    },

    render: function () {
        var self = this;

        if ($("#consult_instance").html() === null) {
                UTILS.Render.animateRender(self.el, self._template, {security_groups: self.options.security_groups, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview, subsubview: self.options.subsubview});
        } else {
            var template = self._template({security_groups: self.options.security_groups, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview, subsubview: self.options.subsubview});
            $(self.el).empty().html(template);
        }

        if (this.options.subview == 'log') {
            this.showLogs();

        } else if (this.options.subview == 'vnc') {
            this.showVNC();

        } else if (this.options.subview == 'software') {
            this.showSoftware();
        }

         if (this.options.subsubview == 'installed_software') {
            this.showInstalledSoftware();

        } else if (this.options.subsubview == 'new_software') {
            this.showNewSoftware();
        }

        $("#instance_vnc").unbind();
        $("#instance_logs").unbind();
        $('#installed_software').unbind();
        $('#new_software').unbind();
        $("#instance_software").unbind();
        $("#instance_vnc").bind("click", this.showVNC);
        $("#instance_logs").bind("click", this.showLogs);
        $("#instance_software").bind("click", this.showSoftware);
        $('#installed_software').bind("click", this.showInstalledSoftware);
        $('#new_software').bind("click", this.showNewSoftware);
        return this;
    }
});
