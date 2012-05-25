function custom_require(urls, callback) {
    var total = urls.length;
    var amount = 0;
    for (var index in urls) {
        var url = urls[index];
        if (navigator.userAgent.indexOf("MSIE") !=-1 || true) {
           url += "?random=" + Math.random()*99999;
           urls[index] = url;
        }
    }
    require(urls, callback);
}

var loadOS = function() {
    $(document).ready(function(){

        UTILS.Auth.initialize("http://mcu5.dit.upm.es:5000/v2.0/");

        var fiRouter = new OSRouter();

        Backbone.history.start();

    });
}

var loadRoutes = function() {
    custom_require([   "js/routes/os-routes.js"
            ], function(someModule) {
                loadOS();
        });
}

var loadViews = function() {
    custom_require([   "js/views/LoginView.js",
                "js/views/NavTabView.js",
                "js/views/TopBarView.js",
                "js/views/SideBarView.js",
                "js/views/RootView.js",
                "js/views/syspanel/OverviewView.js",
                "js/views/syspanel/ImageView.js",
                "js/views/syspanel/InstanceView.js",
                "js/views/syspanel/FlavorView.js",
                "js/views/syspanel/ProjectView.js",
                "js/views/syspanel/ServiceView.js",
                "js/views/syspanel/UserView.js",
                "js/views/syspanel/QuotaView.js",
                "js/views/nova/OverviewView.js",
                "js/views/nova/AccessAndSecurityView.js",
                "js/views/nova/InstancesAndVolumesView.js",
                "js/views/nova/ImagesAndSnapshotsView.js",
                "js/views/forms/UpdateInstanceView.js",
                "js/views/forms/CreateFlavorView.js",
                "js/views/forms/DeleteImagesView.js",
                "js/views/forms/UpdateImageView.js",
                "js/views/forms/LaunchImageView.js",
                "js/views/forms/ConsultImageDetailView.js",
                "js/views/forms/ChangePasswordView.js",
                "js/views/forms/CreateSnapshotView.js",
                "js/views/forms/ConfirmView.js",
                "js/views/nova/InstanceDetailView.js",
                "js/views/SettingsView.js"
            ], function(someModule) {
                loadRoutes();
        });
}

var loadModels = function() {

    custom_require(["js/models/FlavorModel.js",
    			"js/models/OverviewModel.js",
                "js/models/ImageModel.js",
                "js/models/ProjectModel.js",
                "js/models/InstanceModel.js",
                "js/models/UserModel.js",
                "js/models/QuotaModel.js",
                "js/models/KeypairModel.js",
                "js/models/LoginModel.js",
                "js/models/ServiceModel.js",
                "js/models/NavTabModel.js",
                "js/models/TopBarModel.js"
            ], function(someModule) {
                loadViews();
        });
}

var loadUtils = function() {
    custom_require([   "js/os-utils.js"
            ], function(someModule) {
                UTILS.i18n.init();
                loadModels();
        });
}

var loadLibraries = function() {
    custom_require([   "lib/backbone.js",
                "lib/jstack.js",
                "lib/bootstrap.min.js"
            ], function(someModule) {
                loadUtils();
        });
}

var loadTemplates = function() {
    custom_require(["js/load-templates.js"
            ], function(someModule) {
                loadTemplates([
                    'templates/notLoggedInTemplate.html',
                    'templates/imagesTemplate.html',
                    'templates/rootTemplate.html',
                    'templates/navTabTemplate.html',
                    'templates/topBarTemplate.html',
                    'templates/sideBarTemplate.html',
                    'templates/sysOverviewTemplate.html',
                    'templates/instancesTemplate.html',
                    'templates/servicesTemplate.html',
                    'templates/flavorsTemplate.html',
                    'templates/projectsTemplate.html',
                    'templates/usersTemplate.html',
                    'templates/quotasTemplate.html',
                    'templates/novaOverviewTemplate.html',
                    'templates/novaAccessAndSecurityTemplate.html',
                    'templates/novaImagesAndSnapshotsTemplate.html',
                    'templates/novaInstancesAndVolumesTemplate.html',
                    'templates/updateInstanceFormTemplate.html',
                    'templates/createFlavorFormTemplate.html',
                    'templates/deleteImagesFormTemplate.html',
                    'templates/updateImageFormTemplate.html',
                    'templates/launchImageTemplate.html',
                    'templates/consultImageDetailFormTemplate.html',
                    'templates/rebootInstancesFormTemplate.html',
                    'templates/changePasswordFormTemplate.html',
                    'templates/createSnapshotFormTemplate.html',
                    'templates/confirmTemplate.html',
                    'templates/instanceDetailTemplate.html',
                    'templates/settingsTemplate.html'
                ], function(){
                    loadLibraries();
                });
    });
}

var loadModules = function() {
    custom_require([   "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",
                "lib/underscore.js"
            ], function(someModule) {
                loadTemplates();
    });
}


loadModules();  