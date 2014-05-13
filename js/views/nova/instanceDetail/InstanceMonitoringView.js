var InstanceMonitoringView = Backbone.View.extend({

    _template: _.itemplate($('#instanceMonitoringTemplate').html()),


    events: {
        'click #switch_button': 'switch_view',
        'click .graph_button': 'switch_chart'
    },

    initialize: function() {

        var self = this;

        var com_dataset = {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "#099EC6",
            pointColor : "#002E67",
            pointStrokeColor : "#fff"
        };

        var com_opt = {
            scaleOverlay : false,
            scaleOverride : false,
            scaleLineColorX : "transparent",
            scaleLineColorY : "#002E67",
            scaleLineWidth : 3,
            scaleFontFamily : "'comfortaa'",
            scaleFontSize : 12,
            scaleFontStyle : "normal",
            scaleFontColorY : "#099EC6",
            scaleFontColorX : "rgb(127,127,127)",
            scaleShowGridLinesX : true,
            scaleShowGridLinesY : false,
            scaleShowMiniLinesY : false,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 2,
            bezierCurve : false,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 2,
            datasetStroke : true,
            datasetStrokeWidth : 1,
            datasetFill : false  ,
            animation : true,
            animationSteps : 60,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null
        };

        this.cpu_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
        this.cpu_opt = jQuery.extend({}, com_opt);
        this.cpu_opt.scaleSteps = null;
        this.cpu_opt.scaleStepWidth = null;
        this.cpu_opt.scaleStartValue = null;

        this.disk_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
        this.disk_opt = jQuery.extend({}, com_opt);
        this.disk_opt.scaleSteps = null;
        this.disk_opt.scaleStepWidth = null;
        this.disk_opt.scaleStartValue = null;

        this.mem_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
        this.mem_opt = jQuery.extend({}, com_opt);
        this.mem_opt.scaleSteps = null;
        this.mem_opt.scaleStepWidth = null;
        this.mem_opt.scaleStartValue = null;

        this.model.fetch({success: function() {
            self.flavor = new Flavor();
            self.flavor.set({id: self.model.get("flavor").id});
            
            self.flavor.fetch({success: function() {

                self.render();
                
                self.model.getMonitoringStats({callback: function(stats){
                    if (stats !== undefined) {
                        $('#error_monit_info').hide();
                        self.renderSpeedometers();
                        self.updateSpeedometers(stats);
                    }
                    
                    // self.renderCharts();
                   
                }});

            }});

        }});

        // TODO: updateSpeedometers() periodically

    },

    switch_view: function (e) {
        if($('#chart_view').hasClass('hide')) {
            $('#chart_view').removeClass('hide');
            $('#speedometer_view').addClass('hide');
            $('#switch_button').html('Back');
        } else {
            $('#chart_view').addClass('hide');
            $('#speedometer_view').removeClass('hide');
            $('#switch_button').html('Graphs');
        }
    },

    switch_chart: function (e) {
        $( ".graph_button" ).removeClass('active');
        var id = '#' + e.currentTarget.id;
        $(id).addClass('active');
        this.renderCharts(e.currentTarget.id);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
    },

    updateSpeedometers: function (stats) {

        var cpu = Math.round(stats[0].percCPULoad.value);
        var disk = Math.round((this.flavor.get('disk') / 100) * stats[0].percDiskUsed.value);
        var mem = Math.round((this.flavor.get('ram') / 100) * stats[0].percRAMUsed.value);

        this.cpu_speed.drawWithInputValue(cpu);
        this.disk_speed.drawWithInputValue(disk);
        this.mem_speed.drawWithInputValue(mem);
    },

    renderSpeedometers: function () {

        this.cpu_speed = new Speedometer({elementId: 'cpu', size: 300, maxVal: 100, name: 'CPU', units: '%'});
        this.disk_speed = new Speedometer({elementId: 'disk', size: 300, maxVal: this.flavor.get('disk'), name: 'DISK', units: 'GB'});
        this.mem_speed = new Speedometer({elementId: 'mem', size: 300, maxVal: this.flavor.get('ram'), name: 'RAM', units: 'MB'});
        this.cpu_speed.draw();
        this.disk_speed.draw();
        this.mem_speed.draw();
    },

    renderCharts: function (scale) {

        var labels;

        switch (scale) {
            case 'day':
                labels = ["12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
                break;
            case 'week':
                labels = ["Monday","Tuesday","Wendesday","April","May","June","July"];
                break;
            case 'month':
                labels = ["03/01","03/01","03/01","03/01","03/01","03/01","03/01"];
                break;
            default:
                labels = ["12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
                break;
        }

        this.cpu_dataset.labels = labels;
        this.cpu_dataset.datasets[0].data = [28,48,40,19,96,27,100];

        this.disk_dataset.labels = labels;
        this.disk_dataset.datasets[0].data = [28,48,40,19,96,27,100];

        this.mem_dataset.labels = labels;
        this.mem_dataset.datasets[0].data = [28,48,40,19,96,27,100];
        
        var cpu_ctx = document.getElementById("cpu_chart").getContext("2d");
        var cpu_chart = new Chart(cpu_ctx).Line(this.cpu_dataset, this.cpu_opt);
        var disk_ctx = document.getElementById("disk_chart").getContext("2d");
        var disk_chart = new Chart(disk_ctx).Line(this.disk_dataset, this.disk_opt);
        var mem_ctx = document.getElementById("mem_chart").getContext("2d");
        var mem_chart = new Chart(mem_ctx).Line(this.mem_dataset, this.mem_opt);
    },

    render: function () {
        var self = this;

        var template = self._template({});
        $(self.el).empty().html(template);

        return this;
    }

});
