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
    quota: undefined,
    securityGroupsModel: undefined,
    floatingIPsModel: undefined,
    floatingIPPoolsModel: undefined,
    networks: undefined,
    subnets: undefined,
    ports: undefined,
    routers: undefined,

    currentView: undefined,

    timers: {},
    backgroundTime: 180,
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
        this.bpTemplatesModel = new BPTemplates();
        this.bpInstancesModel = new BPInstances();
        this.sdcs = new SDCs();
        this.volumesModel = new Volumes();
        this.volumeSnapshotsModel = new VolumeSnapshots();
        this.instanceSnapshotsModel = new InstanceSnapshots();
        this.images = new Images();
        this.keypairsModel = new Keypairs();
        this.projects = new Projects();
        this.containers = new Containers();
        this.quotas = new Quota();
        this.securityGroupsModel = new SecurityGroups();
        this.floatingIPsModel = new FloatingIPs();
        this.floatingIPPoolsModel = new FloatingIPPools();
        this.networks = new Networks();
        this.subnets = new Subnets();
        this.ports = new Ports();
        this.routers = new Routers();

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

        this.networks.bind("error", function(model, error) {
            console.log("Error in networks:", error);
        });

        this.routers.bind("error", function(model, error) {
            console.log("Error in routers:", error);
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

        this.route('nova/blueprints/instances/', 'blueprint_instances', this.wrap(this.blueprint_instances, this.checkAuthAndTimers, ["bpInstancesModel"]));
        this.route('nova/blueprints/instances/:id', 'blueprint_instance', this.wrap(this.blueprint_instance, this.checkAuthAndTimers, ["bpInstancesModel"]));
        this.route('nova/blueprints/instances/:id/tiers/:tier_id/instances', 'blueprint_instance_tier_instances', this.wrap(this.blueprint_instance_tier_instances, this.checkAuthAndTimers, ["bpInstancesModel"]));

        this.route('nova/blueprints/templates/', 'blueprint_templates', this.wrap(this.blueprint_templates, this.checkAuthAndTimers, ["bpTemplatesModel"]));
        this.route('nova/blueprints/templates/:id', 'blueprint_template', this.wrap(this.blueprint_template, this.checkAuthAndTimers, ["bpTemplatesModel"]));
        this.route('nova/blueprints/catalog/', 'blueprint_templates_catalog', this.wrap(this.blueprint_templates_catalog, this.checkAuthAndTimers, ["bpTemplatesModel"]));
        this.route('nova/blueprints/catalog/:id', 'blueprint_template_catalog', this.wrap(this.blueprint_template_catalog, this.checkAuthAndTimers));

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

        this.route('neutron/networks/', 'consult_networks',  this.wrap(this.neutron_consult_networks, this.checkAuthAndTimers, ["networks", "subnets"]));
        this.route('neutron/networks/:id', 'consult_network_detail',  this.wrap(this.neutron_network_detail, this.checkAuthAndTimers, ["subnets", "ports"]));
        this.route('neutron/networks/subnets/:id', 'consult_subnet_detail',  this.wrap(this.neutron_subnet_detail, this.checkAuthAndTimers, ["subnets"]));
        this.route('neutron/networks/ports/:id', 'consult_port_detail',  this.wrap(this.neutron_port_detail, this.checkAuthAndTimers, ["ports"]));

        this.route('neutron/routers/', 'consult_routers',  this.wrap(this.neutron_consult_routers, this.checkAuthAndTimers, ["routers"]));
        this.route('neutron/routers/:id', 'consult_router_detail',  this.wrap(this.neutron_router_detail, this.checkAuthAndTimers, ["ports", "routers"]));
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
            this.quotas.set({id: UTILS.Auth.getCurrentTenant().id});
            var seconds = this.backgroundTime;
            this.add_fetch("instancesModel", seconds);
            this.add_fetch("sdcs", seconds);
            this.add_fetch("bpTemplatesModel", seconds);
            this.add_fetch("bpInstancesModel", seconds);
            this.add_fetch("volumesModel", seconds);
            this.add_fetch("images", seconds);
            this.add_fetch("quotas", seconds);
            this.add_fetch("flavors", seconds);
            this.add_fetch("volumeSnapshotsModel", seconds);
            this.add_fetch("instanceSnapshotsModel", seconds);
            this.add_fetch("containers", seconds);
            this.add_fetch("securityGroupsModel", seconds);
            this.add_fetch("keypairsModel", seconds);
            this.add_fetch("floatingIPsModel", seconds);
            this.add_fetch("floatingIPPoolsModel", seconds);
            this.add_fetch("networks", seconds);
            this.add_fetch("subnets", seconds);
            this.add_fetch("ports", seconds);
            this.add_fetch("routers", seconds);
            if (this.loginModel.isAdmin() && !UTILS.Auth.isIDM()) {
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
        if (this.navTabView === undefined) {
            this.navTabView = new NavTabView({el: '#navtab', model: self.tabs, loginModel: self.loginModel});
        }
        this.navTabView.render();

        if (this.topBarView === undefined) {
            this.topBarView = new TopBarView({el: '#topbar', model: self.top, loginModel: self.loginModel});
            this.topBarView.render();
        }
        this.topBarView.renderTitle();


        var showTenants = (self.tabs.getActive() == 'Project');
        if (this.sideBarView === undefined) {
            this.sideBarView = new SideBarView({el: '#sidebar', model: self.navs, loginModel: self.loginModel});
            this.sideBarView.el = '#sidebar';
        }
        this.sideBarView.model = self.navs;
        this.sideBarView.render(option, showTenants);
        // Hack for phones
        window.scrollTo(0,0);
    },

    showSysRoot: function(self, option) {
        //this.clear_fetch();
        if (!this.loginModel.isAdmin() || UTILS.Auth.isIDM()) {
           window.location.href = "#nova";
           return false;
        }
        self.top.set({"title":option});
        self.navs = new NavTabModels([
                                    //{name: 'Overview', active: true, url: '#syspanel/'},

                                    //{name: 'Instances', active: false, url: '#syspanel/instances/'},
                                    //{name: 'Services', active: false, url: '#syspanel/services/'},
                                    {name: 'Flavors', iconcss: "icon_nav-flavors", active: false, url: '#syspanel/flavors/'},
                                    //{name: 'Images', active: false, url: '#syspanel/images/images/'},
                                    {name: 'Project Quotas', iconcss: "icon_nav-project", active: false, url: '#syspanel/projects/'}
                                    //{name: 'Users', iconcss: "icon_nav-user", active: false, url: '#syspanel/users/'}
                                    //{name: 'Quotas', iconcss: "icon_nav-quotas", active: false, url: '#syspanel/quotas/'}
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

        var tabsArray = [
            //{name: 'Overview', active: true, url: '#nova/'},
            //{name: 'Virtual Data Centers', active: false, url: '#nova/vdcs/'},
            {name: 'Blueprint', type: 'title'},
            {name: 'Blueprint Instances',  iconcss: "icon_nav-blueprintInstances", css:"small", active: false, url: '#nova/blueprints/instances/'},
            {name: 'Blueprint Templates',  iconcss: "icon_nav-blueprintTemplates", css:"small", active: false, url: '#nova/blueprints/templates/'},
            {name: 'Region', type: 'title'},
            {type: 'regions'},
            {name: 'Compute', type: 'title'},
            {name: 'Instances', iconcss: "icon_nav-instances", active: false, url: '#nova/instances/'},
            {name: 'Images', iconcss: "icon_nav-images", active: false, url: '#nova/images/'},
            {name: 'Flavors', iconcss: "icon_nav-flavors", active: false, url: '#nova/flavors/'},
            {name: 'Security', iconcss: "icon_nav-security", active: false, url: '#nova/access_and_security/'},
            {name: 'Snapshots', iconcss: "icon_nav-snapshots", active: false, url: '#nova/snapshots/'},
            {name: 'Storage', type: 'title'},
            {name: 'Containers', iconcss: "icon_nav-container", active: false, url: '#objectstorage/containers/'},
            {name: 'Volumes', iconcss: "icon_nav-volumes", active: false, url: '#nova/volumes/'}
            
        ];
        if (JSTACK.Keystone.getservice("network") !== undefined) {
            tabsArray.push({name: 'Network', type: 'title'});
            tabsArray.push({name: 'Networks', iconcss: "icon_nav-networks", active: false, url: '#neutron/networks/'});
            tabsArray.push({name: 'Routers', iconcss: "icon_nav-routers", active: false, url: '#neutron/routers/'});
        }
        self.navs = new NavTabModels(tabsArray);
        self.navs.setActive(option);
        self.tabs.setActive('Project');
        self.showRoot(self, 'Project Name');
    },

    blueprint_instances: function(self) {
        self.showNovaRoot(self, 'BP Instances');
        var view = new BlueprintInstancesView({el: '#content', model: self.bpInstancesModel});
        self.newContentView(self,view);
    },

    blueprint_instance: function(self, id) {
        var bp = new BPInstance();
        bp.set({'blueprintName': id});
        bp.fetch({success: function() {
            self.showNovaRoot(self, 'BP Instances', 'Blueprint Instances / ' + bp.get('blueprintName'));
            var view = new BlueprintInstanceView({el: '#content', model: bp, flavors: self.flavors, images: self.images});
            self.newContentView(self,view);
        }});
    },

    blueprint_instance_tier_instances: function(self, id, tier_id) {
        self.showNovaRoot(self, 'BP Instances', 'Blueprint Instances / ' + id + ' / ' + tier_id);
        var bp = new BPInstance();
        bp.set({'blueprintName': id});
        bp.fetch({success: function(instance) {
            var tiers = instance.get('tierDto_asArray');
            tiers.forEach(function(tier) {
                if (tier.name === tier_id) {
                    var vms = tier.tierInstancePDto_asArray || [];
                    var insts = new Instances();
                    vms.forEach(function(vm) {
                        var inst = self.instancesModel.findWhere({name: vm.tierInstanceName});
                        if (inst) {
                            inst.set({paasStatus: vm.status});
                            insts.add(inst);
                        }
                    });
                    self.showNovaRoot(self, 'BP Instances', 'Blueprint Instances / ' + id + ' / ' + tier.name);
                    var view = new BlueprintInstanceTierInstancesView({model: insts, blueprint: bp, tier: tier, projects: self.projects, flavors: self.flavors, el: '#content'});
                    self.newContentView(self,view);
                }
            });
        }
        });
    },

    blueprint_templates: function(self) {
        self.showNovaRoot(self, 'BP Templates');
        var view = new BlueprintTemplatesView({el: '#content', model: self.bpTemplatesModel});
        self.newContentView(self,view);
    },

    blueprint_template: function(self, id) {
        self.showNovaRoot(self, 'BP Templates', 'Blueprint Templates / ' + id);
        var bp = new BPTemplate();
        bp.set({'name': id});
        var view = new BlueprintTemplateView({el: '#content', model: bp, sdcs: self.sdcs, flavors: self.flavors, keypairs: self.keypairsModel, securityGroupsModel: self.securityGroupsModel, images: self.images, networks: self.networks, subnets: self.subnets, loginModel: self.loginModel});
        self.newContentView(self,view);
    },

    blueprint_templates_catalog: function(self) {
        self.showNovaRoot(self, 'BP Templates', 'Blueprint Templates / Catalog');
        var view = new BlueprintTemplatesCatalogView({el: '#content', model: self.bpTemplatesModel});
        self.newContentView(self,view);
    },

    blueprint_template_catalog: function(self, id) {
        self.showNovaRoot(self, 'BP Templates', 'Blueprint Templates / Catalog / ' + id);
        var view = new BlueprintTemplateCatalogView({el: '#content', model: self.bpTemplatesModel, templateId: id, sdcs: self.sdcs, flavors: self.flavors, keypairs: self.keypairsModel, securityGroupsModel: self.securityGroupsModel, images: self.images});
        self.newContentView(self,view);
    },

    nova_access_and_security: function(self) {
        self.showNovaRoot(self, 'Security');
        var view = new AccessAndSecurityView({el: '#content', model: self.keypairsModel, floatingIPsModel: self.floatingIPsModel, floatingIPPoolsModel: self.floatingIPPoolsModel, instances: self.instancesModel, quotas: self.quotas, securityGroupsModel: self.securityGroupsModel});
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
        var tenant = localStorage.getItem('tenant-id');
        var view = new ImagesView({model: self.images, volumeSnapshotsModel: self.volumeSnapshotsModel, instancesModel: self.instancesModel, volumesModel: self.volumesModel, flavors: self.flavors, keypairs: self.keypairsModel, secGroups: self.securityGroupsModel,  quotas: self.quotas, networks: self.networks, ports: self.ports, tenant: tenant, el: '#content'});
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
        var view = new NovaSnapshotsView({instanceSnapshotsModel: self.instanceSnapshotsModel, volumeSnapshotsModel: self.volumeSnapshotsModel, instancesModel: self.instancesModel, volumesModel: self.volumesModel, flavors: self.flavors, keypairs: self.keypairsModel, secGroups: self.securityGroupsModel, el: '#content'});
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
        var view = new NovaInstancesView({model: self.instancesModel, projects: self.projects, keypairs: self.keypairsModel, flavors: self.flavors, el: '#content'});
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

    neutron_consult_networks: function(self) {
        self.showNovaRoot(self, 'Networks');
        var tenant_id = localStorage.getItem('tenant-id');
        var view = new NeutronNetworksView({model: self.networks, tenant_id: tenant_id, subnets: self.subnets, el: '#content'});
        self.newContentView(self,view);
    },

    neutron_network_detail: function(self, id) {
        self.showNovaRoot(self, 'Network Detail');
        var network = new Network();
        var tenant_id = localStorage.getItem('tenant-id');
        network.set({"id": id});
        var view = new NetworkDetailView({model: network, subnets: self.subnets, ports: self.ports, tenant_id: tenant_id, el: '#content'});
        self.newContentView(self,view);
    },

    neutron_subnet_detail: function(self, id) {
        self.showNovaRoot(self, 'Subnet Detail');
        var subnet = new Subnet();
        subnet.set({"id": id});
        var view = new SubnetDetailView({model: subnet, el: '#content'});
        self.newContentView(self,view);
    },

    neutron_port_detail: function(self, id) {
        self.showNovaRoot(self, 'Port Detail');
        var port = new Port();
        port.set({"id": id});
        var view = new PortDetailView({model: port, el: '#content'});
        self.newContentView(self,view);
    },

    neutron_consult_routers: function(self) {
        self.showNovaRoot(self, 'Routers');
        var tenant_id = localStorage.getItem('tenant-id');
        var view = new NeutronRoutersView({model: self.routers, tenant_id: tenant_id, networks: self.networks, el: '#content'});
        self.newContentView(self,view);
    },

    neutron_router_detail: function(self, id) {
        self.showNovaRoot(self, 'Router Detail');
        var router = new Router();
        var tenant_id = localStorage.getItem('tenant-id');
        router.set({"id": id});
        var view = new RouterDetailView({model: router, networks: self.networks, ports: self.ports, subnets: self.subnets, tenant_id: tenant_id, el: '#content'});
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
