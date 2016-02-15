var NovaSnapshotsView = Backbone.View.extend({

    _template: _.itemplate($('#novaSnapshotsTemplate').html()),

    instanceSnapshotsView: undefined,
    volumeSnapshotsView: undefined,
    volumeBackupsView: undefined,

    initialize: function() {
        this.options.instanceSnapshotsModel = UTILS.GlobalModels.get("instanceSnapshotsModel");
        this.options.volumeSnapshotsModel = UTILS.GlobalModels.get("volumeSnapshotsModel");
        this.options.volumeBackupsModel = UTILS.GlobalModels.get("volumeBackupsModel");
        this.options.instancesModel = UTILS.GlobalModels.get("instancesModel");
        this.options.volumesModel = UTILS.GlobalModels.get("volumesModel");
        this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.options.keypairs = UTILS.GlobalModels.get("keypairsModel");
        this.options.secGroups = UTILS.GlobalModels.get("securityGroupsModel");
        this.options.quotas = UTILS.GlobalModels.get("quotas");
        this.render();
        this.instanceSnapshotsView = new NovaInstanceSnapshotsView({model: this.options.instanceSnapshotsModel, quotas:this.options.quotas, instancesModel: this.options.instancesModel, flavors: this.options.flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups, volumes: this.options.volumesModel, el: '#instance_snapshots'});
        this.volumeSnapshotsView = new NovaVolumeSnapshotsView({model: this.options.volumeSnapshotsModel, instancesModel: this.options.instancesModel, volumesModel: this.options.volumesModel, flavors: this.options.flavors, secGroups: this.options.secGroups, el: '#volume_snapshots'});
        this.volumeBackupsView = new VolumeBackupsView({model: this.options.volumeBackupsModel, volumesModel: this.options.volumesModel, el: '#volume_backups'});
    },

    onClose: function() {
        this.instanceSnapshotsView.onClose();
        this.volumeSnapshotsView.onClose();
        this.volumeBackupsView.onClose();
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);
    }

});