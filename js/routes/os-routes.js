var OSRouter = Backbone.Router.extend({

    rootView: undefined,

    tabs: new NavTabModels([{name: 'Project', active: false, url: '#nova'}, {name: 'Admin', active: true, url: '#syspanel'}]),
    top: new TopBarModel({title:'Overview:', subtitle: ''}),
    navs:  new NavTabModels([]),
    next: undefined,

    loginModel: undefined,
    instancesModel: undefined,
    volumesModel: undefined,
    volumeSnapshotsModel: undefined,
    instanceSnapshotsModel: undefined,
    flavors: undefined,
    images: undefined,
    keypairsModel: undefined,
    projects: undefined,
    containers: undefined,
    quotas: undefined,
    securityGroupsModel: undefined,
    floatingIPsModel: undefined,

    currentView: undefined,

    timers: {},
    backgroundTime: 60,
    foregroundTime: 5,

    routes: {
        'auth/login': 'login',
        'auth/switch/:id/': 'switchTenant',
        'auth/logout': 'logout'
    },

    initialize: function() {
        this.loginModel = new LoginStatus();
        this.flavors = new Flavors();
        this.instancesModel = new Instances();
        this.sdcs = new SDCs();
        this.volumesModel = new Volumes();
        this.volumeSnapshotsModel = new VolumeSnapshots();
        this.instanceSnapshotsModel = new InstanceSnapshots();
        this.images = new Images();
        this.keypairsModel = new Keypairs();
        this.projects = new Projects();
        this.containers = new Containers();
        this.quotas = new Quotas();
        this.securityGroupsModel = new SecurityGroups();
        this.floatingIPsModel = new FloatingIPs();

        Backbone.wrapError = function(onError, originalModel, options) {
            return function(model, resp) {
              resp = model === originalModel ? resp : model;
              if (onError) {
                onError(originalModel, resp, options);
              } else {
                originalModel.trigger('error', originalModel, resp, options);
                var subview = new MessagesView({state: "Error", title: "Error. Cause: " + resp.message, info: resp.body});
                subview.render();
              }
            };
          };

        this.instancesModel.bind("error", function(model, error) {
            console.log("Error in instances:", error);
        });

        this.projects.bind("error", function(model, error) {
            console.log("Error in projects:", error);
        });

        this.flavors.bind("error", function(model, error) {
            console.log("Error in flavors:", error);
        });

        this.images.bind("error", function(model, error) {
            console.log("Error in images:", error);
        });

        Backbone.View.prototype.close = function(){
          //this.remove();
          this.unbind();
          if (this.onClose){
            this.onClose();
          }
        };

        this.rootView = new RootView({model:this.loginModel, auth_el: '#auth', root_el: '#root'});
        this.route('', 'init', this.wrap(this.init, this.checkAuthAndTimers));
        this.route('#', 'init', this.wrap(this.init, this.checkAuthAndTimers));

        this.route('home/', 'home', this.wrap(this.init, this.checkAuthAndTimers));

        this.route('syspanel', 'syspanel', this.wrap(this.sys_projects, this.checkAuthAndTimers, ["projects"]));
        this.route('syspanel/', 'syspanel', this.wrap(this.sys_projects, this.checkAuthAndTimers, ["projects"]));

        this.route('settings/', 'settings', this.wrap(this.showSettings, this.checkAuthAndTimers));

        this.route('nova', 'nova', this.wrap(this.nova_instances, this.checkAuthAndTimers, ["instancesModel"]));
        this.route('nova/', 'nova', this.wrap(this.nova_instances, this.checkAuthAndTimers, ["instancesModel"]));

        this.route('nova/blueprints/', 'blueprint_templates', this.wrap(this.blueprint_templates, this.checkAuthAndTimers));
        this.route('nova/blueprints/:id', 'blueprint_template', this.wrap(this.blueprint_template, this.checkAuthAndTimers));

        this.route('nova/volumes/', 'volumes', this.wrap(this.nova_volumes, this.checkAuthAndTimers, ["volumesModel"]));
        this.route('nova/volumes/:id/detail', 'consult_volume',  this.wrap(this.consult_volume, this.checkAuthAndTimers));

        this.route('nova/access_and_security/', 'access_and_security', this.wrap(this.nova_access_and_security, this.checkAuthAndTimers, ["keypairsModel", "securityGroupsModel", "floatingIPsModel"]));
        this.route('nova/access_and_security/keypairs/:name/download/', 'keypair_download', this.wrap(this.nova_keypair_download, this.checkAuthAndTimers));

        this.route('nova/images/', 'images', this.wrap(this.nova_images, this.checkAuthAndTimers, ["images"]));
        this.route('nova/images/:id', 'images',  this.wrap(this.nova_image, this.checkAuthAndTimers));
        this.route('nova/instances/', 'instances', this.wrap(this.nova_instances, this.checkAuthAndTimers, ["instancesModel"]));
        this.route('nova/instances/:id/detail', 'instances', this.wrap(this.nova_instance, this.checkAuthAndTimers, ["instancesModel", "sdcs"]));
        this.route('nova/instances/:id/detail?view=:subview', 'instance', this.wrap(this.nova_instance, this.checkAuthAndTimers));
        this.route('nova/flavors/', 'flavors',  this.wrap(this.nova_flavors, this.checkAuthAndTimers, ["flavors"]));

        this.route('nova/snapshots/', 'snapshots', this.wrap(this.nova_snapshots, this.checkAuthAndTimers, ["volumeSnapshotsModel", "instanceSnapshotsModel"]));
        this.route('nova/snapshots/instances/:id/detail/', 'instance_snapshot', this.wrap(this.instance_snapshot, this.checkAuthAndTimers));
        this.route('nova/snapshots/volumes/:id/detail/', 'volume_snapshot', this.wrap(this.volume_snapshot, this.checkAuthAndTimers));

        this.route('syspanel/services/', 'services',  this.wrap(this.sys_services, this.checkAuthAndTimers));
        this.route('syspanel/flavors/', 'flavors',  this.wrap(this.sys_flavors, this.checkAuthAndTimers, ["flavors"]));
        this.route('syspanel/projects/', 'projects',  this.wrap(this.sys_projects, this.checkAuthAndTimers, ["projects"]));
        this.route('syspanel/projects/:id/users/', 'users_projects',  this.wrap(this.sys_users_projects, this.checkAuthAndTimers));
        this.route('syspanel/users/', 'users',  this.wrap(this.sys_users, this.checkAuthAndTimers));
        this.route('syspanel/quotas/', 'quotas',  this.wrap(this.sys_quotas, this.checkAuthAndTimers, ["quotas"]));

        this.route('objectstorage/containers/', 'consult_containers',  this.wrap(this.objectstorage_consult_containers, this.checkAuthAndTimers, ["containers"]));
        this.route('objectstorage/containers/:name/', 'consult_container',  this.wrap(this.objectstorage_consult_container, this.checkAuthAndTimers));

    },

    wrap: function(func, wrapper, modelArray) {
        var ArrayProto = Array.prototype;
        var slice = ArrayProto.slice;
        return function() {
          var args = [func].concat(slice.call(arguments, 0));
          return wrapper.apply(this, [args, modelArray]);
        };
    },

    initFetch: function() {

        if (Object.keys(this.timers).length === 0) {
            var seconds = this.backgroundTime;
            this.add_fetch("instancesModel", seconds);
            this.add_fetch("sdcs", seconds);
            this.add_fetch("volumesModel", seconds);
            this.add_fetch("images", seconds);
            this.add_fetch("flavors", seconds);
            this.add_fetch("volumeSnapshotsModel", seconds);
            this.add_fetch("instanceSnapshotsModel", seconds);
            this.add_fetch("containers", seconds);
            this.add_fetch("securityGroupsModel", seconds);
            this.add_fetch("keypairsModel", seconds);
            this.add_fetch("floatingIPsModel", seconds);
            if (this.loginModel.isAdmin()) {
                console.log("admin");
                this.add_fetch("projects", seconds);
            }
        }
    },

    checkAuthAndTimers: function() {

        var next = arguments[0][0];
        this.rootView.options.next_view = Backbone.history.fragment;
        if (!this.loginModel.get("loggedIn")) {
            window.location.href = "#auth/login";
            return;
        } else {
            this.initFetch();
            this.update_fetch(arguments[1], this.foregroundTime, this.backgroundTime);
        }
        var args = [this].concat(Array.prototype.slice.call(arguments[0], 1));
        if (next) {
            next.apply(this, args);
        }
    },

    newContentView: function (self, view) {

        if (self.currentView !== undefined){
           self.currentView.close();
        }

        self.currentView = view;

    },

    init: function(self) {
        window.location.href = "#nova";
    },

    login: function() {
       console.log("Rendering auth");
        this.rootView.renderAuth();
    },

    logout: function() {
        this.loginModel.clearAll();
        window.location.href = "#auth/login";
    },

    switchTenant: function(id) {
        var self = this;
        this.loginModel.bind('switch-tenant', function() {
            self.loginModel.unbind('switch-tenant');
            self.clear_fetch();
            self.initFetch();
            self.navigate(self.rootView.options.next_view, {trigger: true, replace: true});
        });
        this.loginModel.switchTenant(id);
    },

    showSettings: function(self) {

        self.top.set({"title":'Dashboard Settings'});
        self.navs = new NavTabModels([{name: 'User Settings', active: true, url: '#settings/'}
                ]);

        self.tabs.setActive('');

        self.showRoot(self, '');
        var view = new SettingsView({el:'#content'});
         self.newContentView(self,view);
        view.render();
    },

    showRoot: function(self,option) {
        self.rootView.renderRoot();
        var navTabView = new NavTabView({el: '#navtab', model: self.tabs, loginModel: self.loginModel});
        navTabView.render();

        var topBarView = new TopBarView({el: '#topbar', model: self.top, loginModel: self.loginModel});
        topBarView.render();

        var showTenants = (self.tabs.getActive() == 'Project');
        var sideBarView = new SideBarView({el: '#sidebar', model: self.navs, title: option, showTenants: showTenants, loginModel: self.loginModel});
        sideBarView.render();
    },

    showSysRoot: function(self, option) {
        //this.clear_fetch();
        if (!this.loginModel.isAdmin()) {
           window.location.href = "#nova";
           return false;
        }
        self.top.set({"title":option});
        self.navs = new NavTabModels([
                                    //{name: 'Overview', active: true, url: '#syspanel/'},

                                    //{name: 'Instances', active: false, url: '#syspanel/instances/'},
                                    //{name: 'Services', active: false, url: '#syspanel/services/'},
                                    {name: 'Flavors', active: false, url: '#syspanel/flavors/'},
                                    //{name: 'Images', active: false, url: '#syspanel/images/images/'},
                                    {name: 'Projects', active: false, url: '#syspanel/projects/'},
                                    {name: 'Users', active: false, url: '#syspanel/users/'},
                                    {name: 'Quotas', active: false, url: '#syspanel/quotas/'}
                                    ]);
        self.navs.setActive(option);
        self.tabs.setActive('Admin');
        self.showRoot(self, 'System Panel');
        return true;
    },

    sys_overview: function(self) {
        if (self.showSysRoot(self, 'Overview')) {
            var overview = new Overview();
            var view = new SysOverviewView({model: overview, el: '#content'});
             self.newContentView(self,view);
            view.render();
        }
    },

    sys_services: function(self) {
        if (self.showSysRoot(self, 'Services')) {
            var services = new Services();
            var view = new ServiceView({model: services, el: '#content'});
            self.newContentView(self,view);
            view.render();
        }
    },

    sys_flavors: function(self) {
        if (self.showSysRoot(self, 'Flavors')) {
            self.flavors.unbind("change");
            //self.add_fetch(self.flavors, 4);
            var view = new FlavorView({model: self.flavors, el: '#content'});
            self.newContentView(self,view);
        }
    },

    sys_projects: function(self) {
        if (self.showSysRoot(self, 'Projects')) {
           var view = new ProjectView({model:self.projects, quotas:self.quotas, el: '#content'});
           self.newContentView(self,view);
        }
    },

    sys_users_projects: function(self, tenant_id) {
        if (self.showSysRoot(self, 'Projects')) {
            var users = new Users();
            users.tenant(tenant_id);
            var all = new Users();
            var view = new UsersForProjectView({model:users, tenant: tenant_id, tenants: self.projects, users: all, el: '#content'});
            self.newContentView(self,view);
        }
    },

    sys_users: function(self) {
        if (self.showSysRoot(self, 'Users')) {
            var users = new Users();
            //users.tenant(JSTACK.Keystone.params.access.token.tenant.id);
            console.log(users);
            var view = new UserView({model:users, el: '#content', tenants: self.projects});
            self.newContentView(self,view);
            //view.render();
        }
    },

    sys_quotas: function(self) {
        if (self.showSysRoot(self, 'Quotas')) {
            var view = new QuotaView({model:self.quotas, el: '#content'});
            self.newContentView(self,view);
            //view.render();
        }
    },

     modify_users: function(self) {
        self.showNovaRoot(self, 'Users for Project');
        var view = new ModifyUsersView({el: '#content', model: users});
        self.newContentView(self,view);
    },

    showNovaRoot: function(self, option, title) {
        //this.clear_fetch();
        if (!title) {
            title = option;
        }
        self.top.set({"title": title});
        self.navs = new NavTabModels([
                            {name: 'Compute', type: 'title'},
                            //{name: 'Overview', active: true, url: '#nova/'},
                            //{name: 'Virtual Data Centers', active: false, url: '#nova/vdcs/'},
                            {name: 'Blueprint Templates', active: false, url: '#nova/blueprints/'},
                            {name: 'Instances', active: false, url: '#nova/instances/'},
                            {name: 'Images', active: false, url: '#nova/images/'},
                            {name: 'Flavors', active: false, url: '#nova/flavors/'},
                            {name: 'Security', active: false, url: '#nova/access_and_security/'},
                            {name: 'Snapshots', active: false, url: '#nova/snapshots/'},
                            {name: 'Storage', type: 'title'},
                            {name: 'Containers', active: false, url: '#objectstorage/containers/'},
                            {name: 'Volumes', active: false, url: '#nova/volumes/'}
                            ]);
        self.navs.setActive(option);
        self.tabs.setActive('Project');
        self.showRoot(self, 'Project Name');
    },

    blueprint_templates: function(self) {
        self.showNovaRoot(self, 'Blueprint Templates');
        var view = new BlueprintTemplatesView({el: '#content'});
        self.newContentView(self,view);
    },

    blueprint_template: function(self, id) {
        self.showNovaRoot(self, 'Blueprint Template', 'Blueprint Template / ' + id);
        var view = new BlueprintTemplateView({el: '#content'});
        self.newContentView(self,view);
    },

    nova_access_and_security: function(self) {
        self.showNovaRoot(self, 'Security');
        var view = new AccessAndSecurityView({el: '#content', model: self.keypairsModel, floatingIPsModel: self.floatingIPsModel, securityGroupsModel: self.securityGroupsModel});
        self.newContentView(self,view);
    },

    nova_keypair_download: function(self, name) {
        self.showNovaRoot(self, 'Download Keypair');
        var keypair = new Keypair();
        keypair.set({'name': name});
        var view = new DownloadKeypairView({el: '#content', model: keypair});
        self.newContentView(self,view);
        view.render();
    },

    nova_images: function(self) {
        self.showNovaRoot(self, 'Images');
        //self.instancesModel.alltenants = false;
        var view = new ImagesView({model: self.images, volumeSnapshotsModel: self.volumeSnapshotsModel, instancesModel: self.instancesModel, volumesModel: self.volumesModel, flavors: self.flavors, keypairs: self.keypairsModel, securityGroupsModel: self.securityGroupsModel, el: '#content'});
        self.newContentView(self,view);
    },

    nova_image: function(self, id) {
        self.showNovaRoot(self, 'Images');
        var image = new ImageVM();
        image.set({"id": id});
        var view = new ConsultImageDetailView({model: image, el: '#content'});
         self.newContentView(self,view);
    },

    nova_flavors: function(self) {
        self.showNovaRoot(self, 'Flavors');
        var view = new FlavorView({model: self.flavors, isProjectTab: true, el: '#content'});
        self.newContentView(self,view);
    },

    nova_snapshots: function(self) {
        self.showNovaRoot(self, 'Snapshots');
        //self.instancesModel.alltenants = false;
        var view = new NovaSnapshotsView({instanceSnapshotsModel: self.instanceSnapshotsModel, volumeSnapshotsModel: self.volumeSnapshotsModel, instancesModel: self.instancesModel, volumesModel: self.volumesModel, flavors: self.flavors, keypairs: self.keypairsModel, el: '#content'});
        self.newContentView(self,view);
    },

    instance_snapshot: function(self, id) {
        self.showNovaRoot(self, 'Snapshots');
        var snapshot = new InstanceSnapshot();
        snapshot.set({"id": id});
        var view = new NovaInstanceSnapshotDetailView({model: snapshot, el: '#content'});
        self.newContentView(self, view);
    },

    volume_snapshot: function(self, id) {
        self.showNovaRoot(self, 'Snapshots');
        var snapshot = new VolumeSnapshot();
        snapshot.set({"id": id});
        var view = new NovaVolumeSnapshotDetailView({model: snapshot, el: '#content'});
        self.newContentView(self, view);
    },

    nova_instances: function(self) {
        self.showNovaRoot(self, 'Instances');
        //self.instancesModel.unbind("change");
        //self.instancesModel.alltenants = false;
        //self.add_fetch(self.instancesModel, 4);
        var view = new NovaInstancesView({model: self.instancesModel, projects: self.projects, flavors: self.flavors, el: '#content'});
        self.newContentView(self,view);
    },

    nova_instance: function(self, id, subview, subsubview) {
        self.showNovaRoot(self, 'Instances');
        //self.instancesModel.alltenants = false;
        var instance = new Instance();
        instance.set({"id": id});
        subview =  subview || 'overview';
        var view = new InstanceDetailView({model: instance, sdcs: self.sdcs, subview: subview, subsubview: subsubview, el: '#content'});
        self.newContentView(self,view);
    },

    nova_volumes: function(self) {
        self.showNovaRoot(self, 'Volumes');
        //self.add_fetch(self.instancesModel, 4);
        //self.instancesModel.alltenants = false;

        var view = new NovaVolumesView({model: self.volumesModel, volumeSnapshotsModel: self.volumeSnapshotModel, instancesModel: self.instancesModel, flavors: self.flavors, el: '#content'});
        self.newContentView(self,view);

    },

    objectstorage_consult_containers: function(self) {
       self.showNovaRoot(self, 'Containers');

       self.containers.unbind("change");
       console.log();
        //self.add_fetch(self.containers, 4);
        var view = new ObjectStorageContainersView({model: self.containers, el: '#content'});
        self.newContentView(self,view);
    },

    objectstorage_consult_container: function(self, name) {
       self.showNovaRoot(self, 'Containers');
        //self.add_fetch(self.containers, 4);
        var container = new Container();
        container.set({"name": name});
        var view = new ObjectStorageContainerView({model: container, containers: self.containers, el: '#content'});
        self.newContentView(self,view);
    },

    consult_volume: function(self, id) {
        self.showNovaRoot(self, 'Volumes');
        var volume = new Volume();
        volume.set({"id": id});
        var view = new VolumeDetailView({model: volume, el: '#content'});
        self.newContentView(self,view);
    },

    update_fetch: function (modelArray, currentSeconds, backgroundSeconds) {

        var self = this;

        modelArray = modelArray || [];

        if (this.timers.current !== undefined) {
            this.timers.current.forEach(function(oldModel) {
                clearInterval(self.timers[oldModel]);
                self.add_fetch(oldModel, backgroundSeconds);
            });
        }

        modelArray.forEach(function(modelName) {
            clearInterval(self.timers[modelName]);
            self.add_fetch(modelName, currentSeconds);
        });

        this.timers.current = modelArray;

    },

    clear_fetch: function() {
        var self = this;
        for (var index in this.timers) {
            var timer_id = this.timers[index];
            clearInterval(timer_id);
        }
        this.timers = {};
    },

    add_fetch: function(modelName, seconds) {
        var self = this;
        this[modelName].fetch();
        var id = setInterval(function() {
            self[modelName].fetch();
        }, seconds*1000);

        this.timers[modelName] = id;
    }
});
