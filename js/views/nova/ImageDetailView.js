var ConsultImageDetailView = Backbone.View.extend({

    _template: _.itemplate($('#consultImageDetailFormTemplate').html()),

    events: {
        'click #launch_img': 'onLaunch'
    },

    initialize: function() {

        this.options.volumeSnapshotsModel = UTILS.GlobalModels.get("volumeSnapshotsModel");
        this.options.instancesModel = UTILS.GlobalModels.get("instancesModel");
        this.options.volumesModel = UTILS.GlobalModels.get("volumesModel");
        this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.options.keypairs = UTILS.GlobalModels.get("keypairsModel");
        this.options.secGroups = UTILS.GlobalModels.get("securityGroupsModel");
        this.options.quotas = UTILS.GlobalModels.get("quotas");
        this.options.networks = UTILS.GlobalModels.get("networks");
        this.options.ports = UTILS.GlobalModels.get("ports");

        this.model.bind("change", this.render, this);
        this.model.fetch();
    },

    onLaunch: function(evt) {
        var subview = new LaunchImageView({el: 'body', images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, quotas: this.options.quotas, instancesModel: this.options.instancesModel, networks: this.options.networks, tenant: this.options.tenant, volumes: this.options.volumesModel, volumeSnapshots: this.options.volumeSnapshotsModel, ports: this.options.ports, model: this.model});
        subview.render();
    },

    render: function () {
        if ($("#instance_details").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, {model:this.model});
        } else {
            $(this.el).html(this._template({model:this.model}));
        }
        return this;
    }

});