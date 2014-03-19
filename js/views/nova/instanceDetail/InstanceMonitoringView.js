var InstanceMonitoringView = Backbone.View.extend({

    _template: _.itemplate($('#instanceMonitoringTemplate').html()),


    events: {

    },

    initialize: function() {
        this.render();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
    },

    render: function () {
        var self = this;

        var template = self._template({});
        $(self.el).empty().html(template);

        // var s = Speedometer({elementId: 'cpu', size: 300, maxVal: 100, name: 'CPU', units: '%'});
        // s.draw();
        // var s1 = Speedometer({elementId: 'disk', size: 300, maxVal: 20, name: 'DISK', units: 'GB'});
        // s1.draw();
        // var s2 = Speedometer({elementId: 'mem', size: 300, maxVal: 1000, name: 'RAM', units: 'MB'});
        // s2.draw();

        return this;
    }

});
