function custom_require(urls, callback) {
    var total = urls.length;
    var amount = 0;
    for (var index in urls) {
        var url = urls[index];
        if (navigator.userAgent.indexOf("MSIE") !=-1 || true) {
           url += "?random=" + Math.round(Math.random()*99999);
           urls[index] = url;
        }
    }
    require(urls, callback);
}

var loadOS = function() {
    $(document).ready(function(){
        var host = "http://localhost:8080";
        host = document.URL.match(/(http.?:\/\/[^\/]*)\/.*/)[1];
        UTILS.Auth.initialize(host + "/keystone/v2.0/", host + "/keystone-admin/v2.0/");
        //UTILS.Auth.initialize("http://mcu5.dit.upm.es:5000/v2.0/");
        var fiRouter = new OSRouter();
        Backbone.history.start();
    });
};

var loadRoutes = function() {
    custom_require(["js/routes/os-routes.js"
            ], function(someModule) {
                loadOS();
        });
};

var loadViews = function() {
    custom_require([   "js/views/LoginView.js",
                "js/views/NavTabView.js",
                "js/views/TopBarView.js",
                "js/views/SideBarView.js",
                "js/views/RootView.js",
                "js/views/TableView.js",
                "js/views/TableTiersView.js",
                "js/views/syspanel/FlavorView.js",
                "js/views/syspanel/ProjectView.js",
                "js/views/syspanel/ServiceView.js",
                "js/views/syspanel/UserView.js",
                "js/views/syspanel/QuotaView.js",
                "js/views/nova/blueprint/SoftwareTierView.js",
                "js/views/nova/blueprint/BlueprintTemplatesView.js",
                "js/views/nova/blueprint/BlueprintTemplateView.js",
                "js/views/nova/blueprint/BlueprintTemplatesCatalogView.js",
                "js/views/nova/blueprint/BlueprintTemplateCatalogView.js",
                "js/views/nova/AccessAndSecurityView.js",
                "js/views/nova/KeypairsView.js",
                "js/views/nova/SecurityGroupsView.js",
                "js/views/nova/FloatingIPsView.js",
                "js/views/nova/VolumeDetailView.js",
                "js/views/nova/VolumesView.js",
                "js/views/nova/ImagesView.js",
                "js/views/nova/InstancesView.js",
                "js/views/nova/InstanceDetailView.js",
                "js/views/nova/instanceDetail/LogView.js",
                "js/views/nova/instanceDetail/OverviewView.js",
                "js/views/nova/instanceDetail/VNCView.js",
                "js/views/nova/instanceDetail/SDCView.js",
                "js/views/nova/instanceDetail/ViewProductAttributes.js",
                "js/views/nova/instanceDetail/EditProductAttributes.js",
                "js/views/nova/ImageDetailView.js",
                "js/views/nova/SnapshotsView.js",
                "js/views/nova/snapshots/InstanceSnapshotsView.js",
                "js/views/nova/snapshots/VolumeSnapshotsView.js",
                "js/views/nova/snapshots/VolumeSnapshotDetailView.js",
                "js/views/nova/snapshots/InstanceSnapshotDetailView.js",
                "js/views/objectstorage/ContainersView.js",
                "js/views/objectstorage/ContainerView.js",
                "js/views/forms/AddUserToProjectView.js",
                "js/views/forms/UpdateInstanceView.js",
                "js/views/forms/CreateFlavorView.js",
                "js/views/forms/UpdateImageView.js",
                "js/views/forms/LaunchImageView.js",
                "js/views/forms/ChangePasswordView.js",
                "js/views/forms/CreateSnapshotView.js",
                "js/views/forms/CreateVolumeSnapshotView.js",
                "js/views/forms/CreateVolumeView.js",
                "js/views/forms/EditVolumeAttachmentsView.js",
                "js/views/forms/ConfirmView.js",
                "js/views/forms/CreateContainerView.js",
                "js/views/forms/CopyObjectView.js",
                "js/views/forms/UploadObjectView.js",
                "js/views/forms/CreateSecurityGroupView.js",
                "js/views/forms/EditSecurityGroupRulesView.js",
                "js/views/forms/CreateKeypairView.js",
                "js/views/forms/ImportKeypairView.js",
                "js/views/forms/DownloadKeypairView.js",
                "js/views/forms/AllocateIPView.js",
                "js/views/forms/InstallSoftwareView.js",
                "js/views/forms/MessagesView.js",
                "js/views/forms/CreateProjectView.js",
                "js/views/forms/EditProjectView.js",
                "js/views/forms/CreateUserView.js",
                "js/views/forms/EditUserView.js",
                "js/views/forms/ModifyUsersView.js",
//              "js/views/forms/ModifyQuotasView.js",
                "js/views/syspanel/NewUsersView.js",
                "js/views/syspanel/UsersForProjectView.js",
                "js/views/SettingsView.js"
            ], function(someModule) {
                loadRoutes();
        });
};

var loadModels = function() {

    custom_require(["js/models/FlavorModel.js",
                "js/models/ImageModel.js",
                "js/models/ProjectModel.js",
                "js/models/InstanceModel.js",
                "js/models/BPTemplateModel.js",
                "js/models/VolumeModel.js",
                "js/models/VolumeSnapshotModel.js",
                "js/models/InstanceSnapshotModel.js",
                "js/models/SDCModel.js",
                "js/models/UserModel.js",
                "js/models/QuotaModel.js",
                "js/models/KeypairModel.js",
                "js/models/LoginModel.js",
                "js/models/ServiceModel.js",
                "js/models/NavTabModel.js",
                "js/models/TopBarModel.js",
                "js/models/ContainerModel.js",
                "js/models/SecurityGroupModel.js",
                "js/models/FloatingIPModel.js",
                "js/models/RoleModel.js"
            ], function(someModule) {
                loadViews();
        });
};

var loadUtils = function() {
    custom_require([   "js/os-utils.js"
            ], function(someModule) {
                loadModels();
        });
};

var loadLibraries = function() {
    custom_require([   "lib/backbone.js",
                "lib/jstack.js",
                "lib/bootstrap.min.js",
                "lib/bootstrap-contextmenu.js",
                "lib/jquery.selectbox-0.1.3.min.js",
                "lib/spin.min.js",
                "lib/jquery.knob.js",
                "lib/jScrollPane.js",
                "lib/xml2json.js",
                "lib/sdc.js",
                "lib/bp.js",
                "lib/cdmi.js",
                "lib/ovf.js",
                "http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"

            ], function(someModule) {
                loadUtils();
        });
};

var loadTemplates = function() {
    custom_require(["js/load-templates.js"
            ], function(someModule) {
                loadTemplates([
                    'templates/auth/login.html',
                    'templates/forms/addUserToProject.html',
                    'templates/forms/updateInstance.html',
                    'templates/forms/createFlavor.html',
                    'templates/forms/updateImage.html',
                    'templates/forms/rebootInstances.html',
                    'templates/forms/changePassword.html',
                    'templates/forms/createSnapshot.html',
                    'templates/forms/createVolumeSnapshot.html',
                    'templates/forms/createVolume.html',
                    'templates/forms/editVolumeAttachments.html',
                    'templates/forms/launchImage.html',
                    'templates/forms/createContainer.html',
                    'templates/forms/copyObject.html',
                    'templates/forms/uploadObject.html',
                    'templates/forms/createSecurityGroup.html',
                    'templates/forms/editSecurityGroupRules.html',
                    'templates/forms/createKeypair.html',
                    'templates/forms/importKeypair.html',
                    'templates/forms/downloadKeypair.html',
                    'templates/forms/allocateIP.html',
                    'templates/forms/installSoftware.html',
                    'templates/forms/createProject.html',
                    'templates/forms/editProject.html',
                    'templates/forms/createUser.html',
                    'templates/forms/editUser.html',
                    'templates/forms/modifyUsers.html',
//                  'templates/forms/modifyQuotas.html',
                    'templates/root/nova/blueprint/softwareTierTemplate.html',
                    'templates/root/nova/blueprint/blueprintTemplates.html',
                    'templates/root/nova/blueprint/blueprintTemplate.html',
                    'templates/root/nova/blueprint/blueprintTemplatesCatalog.html',
                    'templates/root/nova/blueprint/blueprintTemplateCatalog.html',
                    'templates/root/nova/accessAndSecurity.html',
                    'templates/root/nova/keypairs.html',
                    'templates/root/nova/securityGroups.html',
                    'templates/root/nova/floatingIPs.html',
                    'templates/root/nova/snapshots.html',
                    'templates/root/nova/snapshots/instanceSnapshots.html',
                    'templates/root/nova/snapshots/volumeSnapshots.html',
                    'templates/root/nova/snapshots/volumeSnapshotDetail.html',
                    'templates/root/nova/snapshots/instanceSnapshotDetail.html',
                    'templates/root/nova/instances.html',
                    'templates/root/nova/volumes.html',
                    'templates/root/nova/instanceDetail.html',
                    'templates/root/nova/instanceDetail/overview.html',
                    'templates/root/nova/instanceDetail/SDC.html',
                    'templates/root/nova/instanceDetail/VNC.html',
                    'templates/root/nova/instanceDetail/log.html',
                    'templates/root/nova/instanceDetail/viewProductAttributes.html',
                    'templates/root/nova/instanceDetail/editProductAttributes.html',
                    'templates/root/nova/imageDetail.html',
                    'templates/root/nova/volumeDetail.html',
                    'templates/root/objectstorage/containers.html',
                    'templates/root/objectstorage/container.html',
                    'templates/root/sys/images.html',
                    'templates/root/sys/services.html',
                    'templates/root/sys/flavors.html',
                    'templates/root/sys/projects.html',
                    'templates/root/sys/users.html',
                    'templates/root/sys/newUsers.html',
                    'templates/root/sys/usersForProject.html',
                    'templates/root/sys/quotas.html',
                    'templates/root/root.html',
                    'templates/root/navTab.html',
                    'templates/root/topBar.html',
                    'templates/root/sideBar.html',
                    'templates/root/confirm.html',
                    'templates/root/settings.html',
                    'templates/root/table.html',
                    'templates/root/table-tiers.html',
                    'templates/messages.html'
                ], function(){
                    loadLibraries();
                });
    });
};

var loadModules = function() {
    custom_require([    "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",
                        "lib/underscore.js"
            ], function(someModule) {
                loadTemplates();
    });
};


loadModules();
