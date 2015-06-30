var InstanceLogView = Backbone.View.extend({

    _template: _.itemplate($('#instanceLogTemplate').html()),

    logResp: false,

    events: {
        'submit #set_log_form': 'setLogs'
    },

    initialize: function() {

        var self = this;
        this.options = this.options || {};

        this.model.fetch();

        var options = {};
        options.callback = function(resp) {
            self.options.logs = resp.output;
            self.logResp = true;
            self.render();
        };
        this.model.consoleoutput(options);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
    },

    setLogs: function(e) {
        e.preventDefault();

        var options = {} || options;
        var lines = this.$('input[name=set-log]').val();

        lines = parseInt(lines, 10);
        //console.log('Set lines to display: ',lines);

        if (0 < lines <= 1000) {

            options.length = lines;

        } else {

            options.length = 35;
            var subview = new MessagesView({state: "Error", title: "he maximum number of lines displayed should be 1000."});
            subview.render();
        }

        options.callback = function(resp) {
            self.options.logs = resp.output;
            self.logResp = true;
            self.render();
        };

        this.model.consoleoutput(options);
    },

    render: function () {
        var self = this;

        var template = self._template({security_groups: self.options.security_groups, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview, subsubview: self.options.subsubview});
        $(self.el).empty().html(template);

        return this;
    }
});
