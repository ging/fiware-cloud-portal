function custom_require(urls, callback) {
    var total = urls.length;
    var amount = 0;
    for (var index in urls) {
        var url = urls[index];
        if (navigator.userAgent.indexOf("MSIE") !=-1) {
           url += "?random=" + Math.random()*99999;
        }        
    }
    require(urls, callback);
}

var loadFiware = function() {
    $(document).ready(function(){

        UTILS.Auth.initialize("http://138.4.24.120:5000/");

        var fiRouter = new FiwareRouter();

        Backbone.history.start();

    });
}

var loadRoutes = function() {
    custom_require([   "js/routes/fiware-routes.js"
            ], function(someModule) {
                loadFiware();
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
                "js/views/syspanel/ServiceView.js",
                "js/views/syspanel/FlavorView.js",
                "js/views/syspanel/ProjectView.js",
                "js/views/syspanel/UserView.js",
                "js/views/syspanel/QuotaView.js",
                "js/views/nova/OverviewView.js",
                "js/views/nova/AccessAndSecurityView.js",
                "js/views/nova/InstancesAndVolumesView.js",
                "js/views/nova/ImagesAndSnapshotsView.js"
            ], function(someModule) {
                loadRoutes();
        });
}

var loadModels = function() {
    custom_require([   "js/models/FlavorModel.js",
                "js/models/ImageModel.js",
                "js/models/KeypairModel.js",
                "js/models/LoginModel.js",
                "js/models/ServerModel.js",
                "js/models/NavTabModel.js",
                "js/models/TopBarModel.js"
            ], function(someModule) {
                loadViews();
        });
}

var loadUtils = function() {
    custom_require([   "js/fiware-utils.js"
            ], function(someModule) {
                loadModels();
        });
}

var loadLibraries = function() {
    require([   "lib/backbone.js",
                "lib/jstack.js"
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
                    'templates/novaInstancesAndVolumesTemplate.html'
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