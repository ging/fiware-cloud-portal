var InstanceOverviewView = Backbone.View.extend({

    _template: _.itemplate($('#instanceOverviewTemplate').html()),

    flavorResp: false,
    imageResp: false,
    security_groupsResp: false,

    initialize: function() {

        var self = this;
        this.options = this.options || {};

        this.model.bind("change", this.onInstanceDetail, this);
        this.model.fetch();

        var options = {};
        options.callback = function(resp) {
            self.options.security_groups = resp;
            self.security_groupsResp = true;
            self.checkAll();
        };
        JSTACK.Nova.getsecuritygroupforserver(self.model.id, options.callback);
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

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("change");
        if (this.options.flavor) {
            this.options.flavor.unbind("change");
        }
        if (this.options.image) {
            this.options.image.unbind("change");
        }
    },

    close: function(e) {
        this.undelegateEvents();
        this.onClose();
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

        var template = self._template({security_groups: self.options.security_groups, vdc: self.options.vdc, service: self.options.service, model:self.model, flavor:self.options.flavor, image:self.options.image, logs: self.options.logs, vncUrl: self.options.vncUrl, subview: self.options.subview, subsubview: self.options.subsubview});
        $(self.el).empty().html(template);

        return this;
    },
});
