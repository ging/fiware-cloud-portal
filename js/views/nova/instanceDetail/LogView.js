var InstanceLogView = Backbone.View.extend({

    _template: _.itemplate($('#instanceLogTemplate').html()),

    logResp: false,

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

    render: function () {
        var self = this;

        var template = self._template({security_groups: self.options.security_groups, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview, subsubview: self.options.subsubview});
        $(self.el).empty().html(template);

        return this;
    },
});
