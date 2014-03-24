var InstanceDetailView = Backbone.View.extend({

    _template: _.itemplate($('#instanceDetailTemplate').html()),

    overviewView: undefined,
    logView: undefined,
    vncView: undefined,
    monitoringView: undefined,

    initialize: function() {

        this.options = this.options || {};

        this.options.sdcs = UTILS.GlobalModels.get("softwares");
        this.options.sdcCatalog = UTILS.GlobalModels.get("softwareCatalogs");

        this.render();

        this.overviewView = new InstanceOverviewView({el: '#instance_details__overview', model: this.model, sdcs: this.options.sdcs, sdcCatalog: this.options.sdcCatalog});
        this.logView = new InstanceLogView({el: '#instance_details__log', model: this.model});
        this.vncView = new InstanceConnectionView({el: '#instance_details__vnc', model: this.model});
        this.monitoringView = new InstanceMonitoringView({el: '#instance_details__monit', model: this.model});
    
        this.delegateEvents({
            'click #overviewBtn': "showOverview",
            'click #instance_vnc': 'showVNC',
            'click #instance_logs': 'showLogs',
            'click #instance_monitoring': 'showMonitoring'
        });

        this.model.fetch();

    },

    showOverview: function() {
        if (this.options) {
            this.options.subview = "overview";
        }
        $('#instance_details__overview').addClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__monit').removeClass('active');
        $('#overview').addClass('active');
        $('#vnc').removeClass('active');
        $('#log').removeClass('active');
        $('#monitoring').removeClass('active');
    },

    showVNC: function() {
        if (this.options) {
            this.options.subview = "vnc";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__vnc').addClass('active');
        $('#instance_details__monit').removeClass('active');
        $('#overview').removeClass('active');
        $('#log').removeClass('active');
        $('#vnc').addClass('active');
        $('#monitoring').removeClass('active');
    },

    showLogs: function() {
        if (this.options) {
            this.options.subview = "logs";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').addClass('active');
        $('#instance_details__monit').removeClass('active');
        $('#overview').removeClass('active');
        $('#vnc').removeClass('active');
        $('#log').addClass('active');
        $('#monitoring').removeClass('active');
    },

    showMonitoring: function() {
        if (this.options) {
            this.options.subview = "monitoring";
        }
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__monit').addClass('active');
        $('#overview').removeClass('active');
        $('#vnc').removeClass('active');
        $('#log').removeClass('active');
        $('#monitoring').addClass('active');
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();

        this.overviewView.close();
        this.logView.close();
        this.vncView.close();
        this.monitoringView.close();
    },

    close: function(e) {
        this.undelegateEvents();
        $('#instance_details__overview').removeClass('active');
        $('#instance_details__log').removeClass('active');
        $('#instance_details__vnc').removeClass('active');
        $('#instance_details__monit').removeClass('active');
        $('#overview').removeClass('active');
        $('#log').removeClass('active');
        $('#vnc').removeClass('active');
        $('#monitoring').removeClass('active');
        this.onClose();
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

        } else if (this.options.subview == 'monitoring') {
            this.showMonitoring();
        }

        $("#instance_vnc").unbind();
        $("#instance_logs").unbind();
        $("#instance_monitoring").unbind();
        return this;
    }
});
