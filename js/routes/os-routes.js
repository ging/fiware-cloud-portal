var OSRouter = Backbone.Router.extend({
    
    rootView: undefined,
    
    tabs: new NavTabModels([{name: 'Project', active: false, url: '#nova'}, {name: 'Admin', active: true, url: '#syspanel'}]),
    top: new TopBarModel({title:'Overview:', subtitle: ''}),
    navs:  new NavTabModels([]),
    next: undefined,
    
    loginModel: undefined,
    instancesModel: undefined,
    volumesModel: undefined,
    flavors: undefined,
    images: undefined,
    keypairsModel: undefined,
    projects: undefined,
    
    currentView: undefined,
    
    timers: [],
    
    routes: {
        'auth/login': 'login',
        'auth/switch/:id/': 'switchTenant',
        'auth/logout': 'logout'
    },
	
	initialize: function() {
	    this.loginModel = new LoginStatus();
	    this.instancesModel = new Instances();
	    this.volumesModel = new Volumes();
	    this.flavors = new Flavors();
	    this.images = new Images();
	    this.keypairsModel = new Keypairs();
	    this.projects = new Projects();
	    
	    Backbone.View.prototype.close = function(){
          //this.remove();
          this.unbind();
          if (this.onClose){
            this.onClose();
          }
        }
	    
	    this.rootView = new RootView({model:this.loginModel, auth_el: '#auth', root_el: '#root'});
	    this.route('', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('#', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('syspanel', 'syspanel', this.wrap(this.sys_overview, this.checkAuth));
	    this.route('syspanel/', 'syspanel', this.wrap(this.sys_overview, this.checkAuth));
	    
	    this.route('settings/', 'settings', this.wrap(this.showSettings, this.checkAuth));

	    this.route('nova', 'nova', this.wrap(this.nova_overview, this.checkAuth));
	    this.route('nova/', 'nova', this.wrap(this.nova_overview, this.checkAuth));
	    
	    this.route('nova/instances_and_volumes/', 'instances_and_volumes', this.wrap(this.nova_instances_and_volumes, this.checkAuth));
	    this.route('nova/access_and_security/', 'access_and_security', this.wrap(this.nova_access_and_security, this.checkAuth));
	    this.route('nova/images_and_snapshots/', 'images_and_snapshots', this.wrap(this.nova_images_and_snapshots, this.checkAuth));

	    this.route('home/', 'home', this.wrap(this.init, this.checkAuth));
	    this.route('syspanel/images/images/', 'images',  this.wrap(this.sys_images, this.checkAuth));
	    this.route('syspanel/instances/', 'instances',  this.wrap(this.sys_instances, this.checkAuth));
	    this.route('syspanel/services/', 'services',  this.wrap(this.sys_services, this.checkAuth));
	    this.route('syspanel/flavors/', 'flavors',  this.wrap(this.sys_flavors, this.checkAuth));	    
	    this.route('syspanel/projects/', 'projects',  this.wrap(this.sys_projects, this.checkAuth));
	    this.route('syspanel/users/', 'users',  this.wrap(this.sys_users, this.checkAuth));
	    this.route('syspanel/quotas/', 'quotas',  this.wrap(this.sys_quotas, this.checkAuth));
	    
	    this.route('syspanel/flavors/create', 'create_flavor',  this.wrap(this.create_flavor, this.checkAuth));    
	   // this.route('syspanel/images/delete', 'delete_images',  this.wrap(this.delete_images, this.checkAuth));        

	    //this.route('nova/instances_and_volumes/instances/:id/update', 'update_instance', this.wrap(this.update_instance, this.checkAuth));
	    
	    this.route('nova/images_and_snapshots/:id/delete', 'delete_image',  this.wrap(this.delete_image, this.checkAuth));
	    this.route('nova/images_and_snapshots/:id/update', 'edit_image',  this.wrap(this.edit_image, this.checkAuth));
	    this.route('nova/images_and_snapshots/:id', 'consult_image',  this.wrap(this.consult_image, this.checkAuth));
	    this.route('nova/images_and_snapshots/:id/launch/', 'launch_image',  this.wrap(this.launch_image, this.checkAuth));
	    this.route('nova/images_and_snapshots/:name/update', 'edit_image',  this.wrap(this.edit_image, this.checkAuth));		
	    
	    //this.route('nova/instances_and_volumes/instances/:id/detail', 'consult_instance',  _.wrap(this.consult_instance, this.checkAuth));
	    this.route('nova/instances_and_volumes/instances/:id/detail?view=:subview', 'consult_instance',  this.wrap(this.consult_instance, this.checkAuth));
	    this.route('nova/instances_and_volumes/instances/:id/detail', 'consult_instance',  this.wrap(this.consult_instance, this.checkAuth));
	    this.route('nova/instances_and_volumes/volumes/:id/detail', 'consult_volume',  this.wrap(this.consult_volume, this.checkAuth));
	},
	
	wrap: function(func, wrapper, arguments) {
	    var ArrayProto = Array.prototype;
        var slice = ArrayProto.slice;
        return function() {
          var args = [func].concat(slice.call(arguments, 0));
          return wrapper.apply(this, args);
        };
    },
	
	checkAuth: function() {
		
		var next = arguments[0];
        this.rootView.options.next_view = Backbone.history.fragment;
        if (!this.loginModel.get("loggedIn")) {
            window.location.href = "#auth/login";
            return;
        } else {
            if (this.timers.length == 0) {
                this.add_fetch(this.instancesModel, 4);
                this.add_fetch(this.volumesModel, 4);
                this.add_fetch(this.images, 4);
                this.add_fetch(this.flavors, 4);
                if (this.loginModel.isAdmin()) {
                    this.add_fetch(this.projects, 4);
                }
            }
        }
        var args = [this].concat(Array.prototype.slice.call(arguments, 1));
	    next.apply(this, args);
	},
	
	newContentView: function (self, view) {

        if (self.currentView != undefined){
           self.currentView.close();
        }
    
        self.currentView = view;
    
    },
		
	init: function(self) {
	    if (self.loginModel.isAdmin()) {
            window.location.href = "#syspanel";
        } else {
            window.location.href = "#nova";
        }
	},
	
	login: function() {
        this.rootView.renderAuth();
	},
	
	logout: function() {
        this.loginModel.clearAll();
        window.location.href = "#auth/login";
	},
	
	switchTenant: function(id) {
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
        var sideBarView = new SideBarView({el: '#sidebar', model: self.navs, title: option, showTenants: showTenants, tenants: self.loginModel.get("tenants"), tenant: self.loginModel.get("tenant")});
        sideBarView.render();
	},
	
	showSysRoot: function(self, option) {
	    //this.clear_fetch();
	    self.top.set({"title":option});
        self.navs = new NavTabModels([{name: 'Overview', active: true, url: '#syspanel/'}, 
                                    {name: 'Instances', active: false, url: '#syspanel/instances/'},
                                    {name: 'Services', active: false, url: '#syspanel/services/'},
                                    {name: 'Flavors', active: false, url: '#syspanel/flavors/'},
                                    {name: 'Images', active: false, url: '#syspanel/images/images/'},
                                    {name: 'Projects', active: false, url: '#syspanel/projects/'},
                                    {name: 'Users', active: false, url: '#syspanel/users/'},
                                    {name: 'Quotas', active: false, url: '#syspanel/quotas/'}
                                    ]);
        self.navs.setActive(option);
        self.tabs.setActive('Admin');
	    self.showRoot(self, 'System Panel');
	},
	
	sys_overview: function(self) {
	    self.showSysRoot(self, 'Overview');
	    var overview = new Overview();
	    var view = new SysOverviewView({model: overview, el: '#content'});
	     self.newContentView(self,view);
        view.render();
	},
	
	sys_images: function(self) {
	    self.showSysRoot(self, 'Images');
	    //self.add_fetch(self.images, 4);
	    var view = new ImagesView({model: self.images, el: '#content'});
	     self.newContentView(self,view);
	},
	
	delete_images: function(self) {
		console.log("Delete images");
        var view = new DeleteImagesView({model: self.images, el: 'body'});
        view.render();
        self.navigate('#syspanel/images/images/', {trigger: false, replace: true});
	},
	
	delete_image: function(self, id) {
	    console.log("Received delete for image: " + id);
	    var image = new Image();
	    image.set({"id": id});
	    console.log(image.get("id"));
        var view = new DeleteImageView({model: image, el: 'body'});
        view.render();
        self.navigate('#syspanel/images/images/', {trigger: false, replace: true});
	},
	
	edit_image: function(self, id) {
	    console.log("Received update for image: " + id);
	    var image = new Image();
	    image.set({"id": id});
        var view = new UpdateImageView({model: image, el: 'body'});
        self.navigate('#syspanel/images/images/', {trigger: false, replace: true});
	},
	
	consult_image: function(self, id) {
	    self.showNovaRoot(self, 'Images &amp; Snapshots');
	    var image = new Image();
	    image.set({"id": id});
        var view = new ConsultImageDetailView({model: image, el: '#content'});
         self.newContentView(self,view);
	},
	
	launch_image: function(self, id) {
        console.log("Received launch for image: " + id);
        var image = new Image();
        image.set({"id": id});
        var view = new LaunchImageView({model: image, flavors: self.flavors, keypairs: self.keypairsModel, el: 'body'});
        self.navigate('#nova/images_and_snapshots/', {trigger: false, replace: true});
    },
	
	sys_instances: function(self) {
	    self.showSysRoot(self, 'Instances');
	    self.instancesModel.unbind("change");
	    self.instancesModel.alltenants = true;
	    //self.add_fetch(self.instancesModel, 4);
	    var view = new InstanceView({model: self.instancesModel, projects: self.projects, flavors: self.flavors, el: '#content'});
	    self.newContentView(self,view);
	},

	sys_services: function(self) {
	    self.showSysRoot(self, 'Services');
	    console.log("Services");
	    var services = new Services();
	    var view = new ServiceView({model: services, el: '#content'});
	    self.newContentView(self,view);
        view.render();
	},
	
	sys_flavors: function(self) {
	    self.showSysRoot(self, 'Flavors');	
	    self.flavors.unbind("change");
	    //self.add_fetch(self.flavors, 4);
	    var view = new FlavorView({model: self.flavors, el: '#content'});
	    self.newContentView(self,view);
	},
	
	create_flavor: function(self) {
	    var flavor = new Flavor();
        var view = new CreateFlavorView({model: flavor, el: 'body'});
        view.render();
        self.navigate('#syspanel/flavors/', {trigger: false, replace: true});
	},
	
	sys_projects: function(self) {
	    self.showSysRoot(self, 'Projects');
	    var view = new ProjectView({model:self.projects, el: '#content'});
	     self.newContentView(self,view);
	},
	
	sys_users: function(self) {
	    self.showSysRoot(self, 'Users');
	    var users = new Users();
	    var view = new UserView({model:users, el: '#content'});
	     self.newContentView(self,view);
        view.render();
	},
	
	sys_quotas: function(self) {
	    self.showSysRoot(self, 'Quotas');
	    var quotas = new Quotas();
	    var view = new QuotaView({model:quotas, el: '#content'});
	     self.newContentView(self,view);
        view.render();
	},
	
	showNovaRoot: function(self, option) {
        //this.clear_fetch();
        self.top.set({"title":option});
        self.navs = new NavTabModels([   {name: 'Overview', active: true, url: '#nova/'}, 
                            {name: 'Instances &amp; Volumes', active: false, url: '#nova/instances_and_volumes/'},
                            /*{name: 'Access &amp; Security', active: false, url: '#nova/access_and_security/'},*/
                            {name: 'Images &amp; Snapshots', active: false, url: '#nova/images_and_snapshots/'}
                            ]);
        self.navs.setActive(option);
        self.tabs.setActive('Project');
	    self.showRoot(self, 'Manage Compute');
	},
	
	nova_overview: function(self) {
	    self.showNovaRoot(self, 'Overview');
	    var view = new NovaOverviewView({el: '#content'});
	     self.newContentView(self,view);
        view.render();
	},
	
	nova_access_and_security: function(self) {
	    self.showNovaRoot(self, 'Access &amp; Security');
	    var view = new AccessAndSecurityView({el: '#content', model: self.keypairsModel});
	     self.newContentView(self,view);
	},
	
	nova_images_and_snapshots: function(self) {
	    self.showNovaRoot(self, 'Images &amp; Snapshots');
	    var view = new ImagesAndSnapshotsView({el: '#content', model:self.images, flavors: self.flavors, keypairs: self.keypairsModel});
	     self.newContentView(self,view);
	},
	
	nova_instances_and_volumes: function(self) {
	    self.showNovaRoot(self, 'Instances &amp; Volumes');
	    //self.add_fetch(self.instancesModel, 4);
	    self.instancesModel.alltenants = false;
	    var view = new InstancesAndVolumesView({instancesModel: self.instancesModel, volumesModel: self.volumesModel, flavors: self.flavors, el: '#content'});
	    self.newContentView(self,view);
	},
	
	consult_instance: function(self, id, subview) {
		console.log("Subview="+subview);
	    self.showNovaRoot(self, 'Instances &amp; Volumes');
        var instance = new Instance();
        instance.set({"id": id});
        if (subview == undefined) {
        	subview = 'overview';
        }	
        var view = new InstanceDetailView({model: instance, subview: subview, el: '#content'});
        self.newContentView(self,view);
	},
	
	consult_volume: function(self, id) {
        self.showNovaRoot(self, 'Instances &amp; Volumes');
        var volume = new Volume();
        volume.set({"id": id});
        var view = new VolumeDetailView({model: volume, el: '#content'});
        self.newContentView(self,view);
    },
	
	clear_fetch: function() {
	    var self = this;
	    for (var index in this.timers) {
	        var timer_id = this.timers[index];
	        clearInterval(timer_id);
	    }
	    this.timers = [];
	},
	
	add_fetch: function(model, seconds) {
	    model.fetch();
        var id = setInterval(function() {
            model.fetch();
        }, seconds*1000);
        
        this.timers.push(id);
	}
});
