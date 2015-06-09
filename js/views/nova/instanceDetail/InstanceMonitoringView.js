var InstanceMonitoringView = Backbone.View.extend({

    _template: _.itemplate($('#instanceMonitoringTemplate').html()),


    events: {
        'click #switch_button': 'switch_view',
        'click #refresh_button': 'refresh_stats',
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

        this.historic_data = undefined;

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
                        self.renderSpeedometers();
                        self.updateSpeedometers(stats);
                        $('#error_monit_info').hide();
                        $('#refresh_button').prop('disabled', false);
                    }
                }});

                self.model.getHistoricMonitoringStats({callback: function(stats){
                    if (stats !== undefined && stats.length > 0) {
                        $('#switch_button').prop('disabled', false);
                        $('#switch_button').html('Graphs');
                        self.historic_data = stats;
                        self.renderCharts('day');
                    } 
                }, error: function () {
                }});

            }});

        }});
    },

    refresh_stats: function () {
        var self = this;
        
        // para dar efecto de que se mueve
        this.cpu_speed.drawWithInputValue(0);
        //this.disk_speed.drawWithInputValue(stats[0].percDiskUsed.value);
        this.disk_speed.drawWithInputValue(0);
        this.mem_speed.drawWithInputValue(0);

        self.model.getMonitoringStats({callback: function(stats){
            if (stats !== undefined) {
                self.updateSpeedometers(stats);
            }
        }});
    },

    switch_view: function (e) {
        if($('#chart_view').hasClass('hide')) {
            $('#chart_view').removeClass('hide');
            $('#speedometer_view').addClass('hide');
            $('#refresh_button').addClass('hide');
            $('#switch_button').html('Back');
        } else {
            $('#chart_view').addClass('hide');
            $('#speedometer_view').removeClass('hide');
            $('#refresh_button').removeClass('hide');
            $('#switch_button').html('Graphs');
            this.refresh_stats();
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
        //this.disk_speed.drawWithInputValue(stats[0].percDiskUsed.value);
        this.disk_speed.drawWithInputValue(disk);
        this.mem_speed.drawWithInputValue(mem);
    },

    renderSpeedometers: function () {

        this.cpu_speed = new Speedometer({elementId: 'cpu', size: 300, maxVal: 100, name: 'CPU', units: '%'});
        this.disk_speed = new Speedometer({elementId: 'disk', size: 300, maxVal: this.flavor.get('disk'), name: 'DISK', units: 'GB'});
        //this.disk_speed = new Speedometer({elementId: 'disk', size: 300, maxVal: 100, name: 'DISK', units: '%'});
        this.mem_speed = new Speedometer({elementId: 'mem', size: 300, maxVal: this.flavor.get('ram'), name: 'RAM', units: 'MB'});
        this.cpu_speed.draw();
        this.disk_speed.draw();
        this.mem_speed.draw();
    },

    renderCharts: function (scale) {

        //console.log('RENDER ', scale, this.historic_data);

        if (this.historic_data && this.historic_data.length > 0) {

            var labels = [];
            var cpu_data = [];
            var mem_data = [];
            var disk_data = [];

            var last_hour = this.historic_data[this.historic_data.length - 1].timestamp.split('T')[1].split(':')[0];
            var last_day = this.historic_data[this.historic_data.length - 1].timestamp.split('T')[0].split('-')[2];
            var last_month = this.historic_data[this.historic_data.length - 1].timestamp.split('T')[0].split('-')[1];
            var prev_month = parseInt(last_month, 10) - 1;

            switch (scale) {
                case 'day':

                    for (var h = last_hour - 24; h <= last_hour; h = h + 3) {
                        if (h < 0) {
                            labels.push(24 + h + ':00');
                        } else {
                            labels.push(h + ':00');
                        }

                    }
                    for (var i = this.historic_data.length - 25; i <= this.historic_data.length - 1; i = i + 3) {
                        if (this.historic_data[i]) {
                            cpu_data.push(this.historic_data[i].percCPULoad.value);
                            disk_data.push((this.flavor.get('disk') / 100) * this.historic_data[i].percDiskUsed.value);
                            mem_data.push((this.flavor.get('ram') / 100) * this.historic_data[i].percRAMUsed.value);
                        } else {
                            cpu_data.push(0);
                            mem_data.push(0);
                            disk_data.push(0);
                        }
                    }

                    break;
                case 'week':
    
                    for (var d = last_day - 7; d <= last_day; d++) {
                        if (d <= 0) {
                            labels.push(30 + d + '/' + prev_month);
                        } else {
                            labels.push(d + '/' + last_month);
                        }

                    }
                    for (var j = this.historic_data.length - 169; j <= this.historic_data.length; j = j + 24) {
                        if (this.historic_data[j]) {
                            cpu_data.push(this.historic_data[j].percCPULoad.value);
                            disk_data.push((this.flavor.get('disk') / 100) * this.historic_data[j].percDiskUsed.value);
                            mem_data.push((this.flavor.get('ram') / 100) * this.historic_data[j].percRAMUsed.value);
                        } else {
                            cpu_data.push(0);
                            mem_data.push(0);
                            disk_data.push(0);
                        }
                    }
                    break;
                case 'month':
                    for (var m = last_day - 30; m <= last_day; m++) {
                        if (m <= 0) {
                            labels.push(30 + m + '/' + prev_month);
                        } else {
                            labels.push(m + '/' + last_month);
                        }

                    }
                    for (var k = this.historic_data.length - 721; k <= this.historic_data.length; k = k + 24) {
                        if (this.historic_data[k]) {
                            cpu_data.push(this.historic_data[k].percCPULoad.value);
                            disk_data.push((this.flavor.get('disk') / 100) * this.historic_data[k].percDiskUsed.value);
                            mem_data.push((this.flavor.get('ram') / 100) * this.historic_data[k].percRAMUsed.value);
                        } else {
                            cpu_data.push(0);
                            mem_data.push(0);
                            disk_data.push(0);
                        }
                    }

                    break;
            }

            this.cpu_dataset.labels = labels;
            this.cpu_dataset.datasets[0].data = cpu_data;

            this.disk_dataset.labels = labels;
            this.disk_dataset.datasets[0].data = disk_data;

            this.mem_dataset.labels = labels;
            this.mem_dataset.datasets[0].data = mem_data;

            var max = _.max(this.disk_dataset.datasets[0].data);
            var min = _.min(this.disk_dataset.datasets[0].data);
            if (max === min) {
                this.disk_opt.scaleOverride = true;
                this.disk_opt.scaleSteps = 5;
                this.disk_opt.scaleStepWidth = 1;
                this.disk_opt.scaleStartValue = max - 3;
            }
            max = _.max(this.cpu_dataset.datasets[0].data);
            min = _.min(this.cpu_dataset.datasets[0].data);
            if (max === min) {
                this.cpu_opt.scaleOverride = true;
                this.cpu_opt.scaleSteps = 5;
                this.cpu_opt.scaleStepWidth = 1;
                this.cpu_opt.scaleStartValue = max - 3;
            }
            max = _.max(this.mem_dataset.datasets[0].data);
            min = _.min(this.mem_dataset.datasets[0].data);
            if (max === min) {
                this.mem_opt.scaleOverride = true;
                this.mem_opt.scaleSteps = 5;
                this.mem_opt.scaleStepWidth = 1;
                this.mem_opt.scaleStartValue = max - 3;
            }
            
            var cpu_ctx = document.getElementById("cpu_chart").getContext("2d");
            var cpu_chart = new Chart(cpu_ctx).Line(this.cpu_dataset, this.cpu_opt);
            var disk_ctx = document.getElementById("disk_chart").getContext("2d");
            var disk_chart = new Chart(disk_ctx).Line(this.disk_dataset, this.disk_opt);
            var mem_ctx = document.getElementById("mem_chart").getContext("2d");
            var mem_chart = new Chart(mem_ctx).Line(this.mem_dataset, this.mem_opt);

        }
    },

    render: function () {
        var self = this;

        var template = self._template({});
        $(self.el).empty().html(template);

        return this;
    }

});
