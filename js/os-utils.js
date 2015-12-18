var UTILS = UTILS || {};

// Current version is **0.1**.

UTILS.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
UTILS.AUTHORS = 'GING';

UTILS.GlobalModels = (function(U, undefined) {

    models= {
        loginModel:undefined,
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
        routers: undefined
    };

    var timers = {};
    var backgroundTime = 180;
    var foregroundTime = 7;

    var initialize = function() {
        models.loginModel = new LoginStatus();
        models.flavors = new Flavors();
        models.instancesModel = new Instances();
        models.bpTemplatesModel = new BPTemplates();
        models.bpInstancesModel = new BPInstances();
        models.softwares = new Softwares();
        models.softwareCatalogs = new SoftwareCatalogs();
        models.volumesModel = new Volumes();
        models.volumeSnapshotsModel = new VolumeSnapshots();
        models.instanceSnapshotsModel = new InstanceSnapshots();
        models.images = new Images();
        models.keypairsModel = new Keypairs();
        models.projects = new Projects();
        models.containers = new Containers();
        models.quotas = new Quota();
        models.securityGroupsModel = new SecurityGroups();
        models.floatingIPsModel = new FloatingIPs();
        models.floatingIPPoolsModel = new FloatingIPPools();
        models.networks = new Networks();
        models.subnets = new Subnets();
        models.ports = new Ports();
        models.routers = new Routers();

        models.instancesModel.bind("error", function(model, error) {
            console.log("Error in instances:", error);
        });

        models.projects.bind("error", function(model, error) {
            console.log("Error in projects:", error);
        });

        models.flavors.bind("error", function(model, error) {
            console.log("Error in flavors:", error);
        });

        models.images.bind("error", function(model, error) {
            console.log("Error in images:", error);
        });

        models.networks.bind("error", function(model, error) {
            console.log("Error in networks:", error);
        });

        models.routers.bind("error", function(model, error) {
            console.log("Error in routers:", error);
        });
    };

    var init_fetch = function() {
        if (Object.keys(timers).length === 0) {
            models.quotas.set({id: UTILS.Auth.getCurrentTenant().id});
            var seconds = backgroundTime;
            add_fetch("instancesModel", seconds);
            add_fetch("softwares", seconds);
            add_fetch("softwareCatalogs", seconds);
            add_fetch("bpTemplatesModel", seconds);
            add_fetch("bpInstancesModel", seconds);
            add_fetch("volumesModel", seconds);
            add_fetch("images", seconds);
            add_fetch("quotas", seconds);
            add_fetch("flavors", seconds);
            add_fetch("volumeSnapshotsModel", seconds);
            add_fetch("instanceSnapshotsModel", seconds);
            add_fetch("containers", seconds);
            add_fetch("securityGroupsModel", seconds);
            add_fetch("keypairsModel", seconds);
            add_fetch("floatingIPsModel", seconds);
            add_fetch("floatingIPPoolsModel", seconds);
            add_fetch("networks", seconds);
            add_fetch("subnets", seconds);
            add_fetch("ports", seconds);
            add_fetch("routers", seconds);
            if (models.loginModel.isAdmin() && !UTILS.Auth.isIDM()) {
                add_fetch("projects", seconds);
            }
        }
    };

    var update_fetch = function (modelArray) {

        modelArray = modelArray || [];

        if (timers.current !== undefined) {
            timers.current.forEach(function(oldModel) {
                clearInterval(timers[oldModel]);
                add_fetch(oldModel, backgroundTime);
            });
        }

        modelArray.forEach(function(modelName) {
            clearInterval(timers[modelName]);
            add_fetch(modelName, foregroundTime);
        });

        timers.current = modelArray;

    };

    var clear_fetch = function() {
        for (var index in timers) {
            var timer_id = timers[index];
            clearInterval(timer_id);
        }
        timers = {};
    };

    var add_fetch = function(modelName, seconds) {
        send_fetch(modelName);
        var id = setInterval(function() {
            send_fetch(modelName);
        }, seconds*1000);

        timers[modelName] = id;
    };

    var send_fetch = function (modelName) {
        if (modelName === 'networks' || modelName === 'subnets' || modelName === 'ports' || modelName === 'routers') {
            if (JSTACK.Keystone.getendpoint(UTILS.Auth.getCurrentRegion(), "network") !== undefined ) {
                models[modelName].fetch();
            }
            
        } else if (modelName === 'containers') {
            if (JSTACK.Keystone.getendpoint(UTILS.Auth.getCurrentRegion(), "object-store") !== undefined ) {
                models[modelName].fetch();
            }

        } else {
            models[modelName].fetch();
        }
    };

    var get = function(model) {
        return models[model];
    };

    return {
        initialize: initialize,
        get: get,
        init_fetch: init_fetch,
        clear_fetch: clear_fetch,
        update_fetch: update_fetch
    };

})(UTILS);

UTILS.Auth = (function(U, undefined) {

    var tenants = [];
    var access_token_;
    var regions_;
    var current_region_;
    var is_idm_ = false;
    var regions_sanity_ = {};

    function initialize(url, adminUrl, isIDM) {
        JSTACK.Keystone.init(url, adminUrl);
        is_idm_ = isIDM || false;
    }

    function isIDM() {
        return is_idm_;
    }

    function goAuth() {
        window.location.href = '/idm/auth';
    }
    function logout() {
        window.location.href = '#auth/logout';
    }

    function getToken() {
        return JSTACK.Keystone.params.token;
    }

    function getAccessToken() {
        return access_token_;
    }

    function getName() {
        return JSTACK.Keystone.params.access.user.name;
    }

    function getTenants(callback, access_token) {
        console.log('GET TENANTS', access_token);
        if (U.Auth.isIDM() && access_token) {
            JSTACK.Keystone.params.access_token = access_token;
            if(JSTACK.Keystone.params.version !== 3) JSTACK.Keystone.params.token = access_token;
        } else {
            JSTACK.Keystone.params.access_token = getAccessToken();
        }
        return JSTACK.Keystone.gettenants(callback, false, function (e) {
            logout();
        });
    }

    var getCurrentTenant = function() {
        return JSTACK.Keystone.params.access.token.tenant;
    };

    var getRegions = function() {
        
        // if (JSTACK.Keystone.params.access.user.cloud_role === 'trial') {
        //     return ['Spain2'];
        // } else if (JSTACK.Keystone.params.access.user.cloud_role === 'community') {
        //     return [JSTACK.Keystone.params.access.user.default_region];
        // }

        // ambos inclusive
        var minId = 13693;

        if (JSTACK.Keystone.params.access.user.actorId >= minId) {
            return ['Spain2'];
        }
        return regions_;
    };

    var updateRegionsStatus = function(callback, error) {

        var regions = getRegions();

        for (var r in regions) {
            Sanity.API.getNodeStatus(regions[r], updateRegionStatus, undefined);
        }
    };

    function updateRegionStatus(region, sanity) {
        var status = 'down';
        if (sanity === 'OK') status = 'up';
        else if (sanity === 'POK' || sanity === 'N/A') status = 'mid';
        regions_sanity_[region] = status;
    }

    var getRegionStatus = function (region) {
        return regions_sanity_[region];
    };

    var getCurrentRegion = function() {
        return current_region_;
    };

    var switchRegion = function(regId) {
        current_region_ = regId;
    };

    var isAuthenticated = function() {
        return JSTACK.Keystone.params.currentstate == JSTACK.Keystone.STATES.AUTHENTICATED;
    };

    var isAdmin = function() {
        var roles = JSTACK.Keystone.params.access.user.roles;
        //console.log("Roels: ", roles);
        for (var index in roles) {
            var rol = roles[index];
            if (rol.name === "admin")
            return true;
        }
        return false;
    };

    var switchTenant = function(tenant, access_token, callback, error) {
        if (U.Auth.isIDM()) {
            authenticate(tenant, access_token, callback, error);
        } else {
            authenticateWithCredentials(undefined, undefined, tenant, JSTACK.Keystone.params.token, callback, error);
        }
    };


    function authenticateWithCredentials(username, password, tenant, token, callback, error) {

        var _authenticatedWithTenant = function (resp) {
            console.log("Authenticated in tenant ", tenant);

            changeEndpoints();

            callback();
        };

        var _authenticatedWithToken = function (resp) {
            callback();
        };

        var _authenticatedWithoutTenant = function(resp) {
            var ok = function (resp) {
                console.log("Tenants received", resp);
                tenants = resp.tenants;
                _tryTenant();
            };

            JSTACK.Keystone.gettenants(ok);
        };

        var _tryTenant = function(tenant) {
            console.log("Trying tenant ", tenant);
            if (tenants.length > 0) {
                tenant = tenant || tenants.pop();
                console.log("Authenticating for tenant " + JSON.stringify(tenant.id));
                JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant.id, _authenticatedWithTenant, _error);
            } else {
                console.log("Error authenticating");
                error("No tenant");
            }
        };


        var getToken = function() {
            return JSTACK.Keystone.params.token;
        };

        var onError = function(msg) {
            error(msg);
        };

        var _error = function() {
            _tryTenant();
        };

        var _credError = function() {
            error("Bad credentials");
        };

        var success;

        if (tenant !== undefined) {
            success = _authenticatedWithTenant;
            console.log("Authenticating with tenant");
        } else if (token !== undefined) {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating with token");
        } else {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating without tenant");
        }
        JSTACK.Keystone.authenticate(username, password, token, tenant, success, _credError);
    }

    function authenticate(tenant, access_token, callback, error) {
        access_token_ = access_token;

        var tenant_ = tenant;

        var check_user = function () {

            $.ajax({
                type: "GET",
                url: 'terms_app/api/v1/accepted?version=1.1&userid=' + JSTACK.Keystone.params.access.user.id,
                async: true
            }).done(function(data) {
                if (!data) {
                    $('#my_mo_modal').modal();
                }
            }).error(function(xhr, status) {
                $('#my_mo_modal').modal();
            });
        };

        var _authenticatedWithTenant = function (resp) {
            console.log("Authenticated for tenant ", tenant_);
            console.log("Token: ", JSTACK.Keystone.params.access.token.id);

            check_user();

            changeEndpoints();

            var t = Object.create(resp.access.token.tenant);
            t.id = tenant_;
            callback(t);
        };

        var _tryTenant = function(tenants) {

            if (tenants.length > 0) {
                if (!tenant_ || tenants.indexOf(tenant_) !== -1) {
                    tenant_ = tenants.pop().id;
                }
                console.log("Authenticating for tenant " + tenant_);
                JSTACK.Keystone.authenticate(undefined, undefined, access_token, tenant_, _authenticatedWithTenant, _credError);
            } else {

                $('#no_orgs_modal').on('hide.bs.modal', function (e) {
                    window.location.href = "https://account.lab.fiware.org";
                });
                $('#no_orgs_modal').modal();

                console.log("Error authenticating");
                error(-1);
            }
        };


        var getToken = function() {
            return JSTACK.Keystone.params.token;
        };

        var onError = function(msg) {
            error(msg);
        };

        var _credError = function() {
            error("Bad credentials");
        };

        getTenants(function (resp) {
            _tryTenant(resp.tenants);
        }, access_token_);

    }

    function changeEndpoints () {

        var host = "localhost:8080";
        host = document.URL.match(/http.?:\/\/([^\/]*)\/.*/)[1];

        console.log("Changing endpoint URLS to ", host);

        regions_ = [];
        var e, compute, volume, image, objectstorage, neutron, murano;

        if (JSTACK.Keystone.params.version === 3) {
            compute = JSTACK.Keystone.getservice("compute");
            

            for (e in compute.endpoints) {
                compute.endpoints[e].url = compute.endpoints[e].region + "/compute" + compute.endpoints[e].url.replace(/.*:[0-9]*/, "");
        
                //if (!compute.endpoints[e].hidden) regions_.push(compute.endpoints[e].region);
                if (regions_.indexOf(compute.endpoints[e].region) === -1) {
                    regions_.push(compute.endpoints[e].region);
                }
            }

            volume = JSTACK.Keystone.getservice("volume");
            if (volume !== undefined) {
                for (e in volume.endpoints) {
                    volume.endpoints[e].url = volume.endpoints[e].region + "/volume" + volume.endpoints[e].url.replace(/.*:[0-9]*/, "");
                }
            }
            
            image = JSTACK.Keystone.getservice("image");
            if (image !== undefined) {
                for (e in image.endpoints) {
                    image.endpoints[e].url = image.endpoints[e].region + "/image" + image.endpoints[e].url.replace(/.*:[0-9]*/, "");
                }
            }

            objectstorage = JSTACK.Keystone.getservice("object-store");
            if (objectstorage !== undefined) {
                for (e in objectstorage.endpoints) {
                    objectstorage.endpoints[e].url = objectstorage.endpoints[e].region  + "/object-store" + objectstorage.endpoints[e].url.replace(/.*:[0-9]*/, "");
                }
            }

            neutron = JSTACK.Keystone.getservice("network");
            if (neutron !== undefined) {
                for (e in neutron.endpoints) {
                    neutron.endpoints[e].url = neutron.endpoints[e].region + "/network" + neutron.endpoints[e].url.replace(/.*:[0-9]*/, "");
                }
            }

            murano = JSTACK.Keystone.getservice("application-catalog");
            if (murano !== undefined) {
                for (e in murano.endpoints) {
                    murano.endpoints[e].url = murano.endpoints[e].region + "/application-catalog/v1" + murano.endpoints[e].url.replace(/.*:[0-9]*/, "");
                }
            }

        } else {

            compute = JSTACK.Keystone.getservice("compute");
            console.log(compute);
            for (e in compute.endpoints) {
                compute.endpoints[e].adminURL = compute.endpoints[e].region + "/compute" + compute.endpoints[e].adminURL.replace(/.*:[0-9]*/, "");
                compute.endpoints[e].publicURL = compute.endpoints[e].region + "/compute" + compute.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
                compute.endpoints[e].internalURL = compute.endpoints[e].region + "/compute" + compute.endpoints[e].internalURL.replace(/.*:[0-9]*/, "");
            
                if (!compute.endpoints[e].hidden) regions_.push(compute.endpoints[e].region);
            }

            volume = JSTACK.Keystone.getservice("volume");
            if (volume !== undefined) {
                for (e in volume.endpoints) {
                    volume.endpoints[e].adminURL = volume.endpoints[e].region + "/volume" + volume.endpoints[e].adminURL.replace(/.*:[0-9]*/, "");
                    volume.endpoints[e].publicURL = volume.endpoints[e].region + "/volume" + volume.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
                    volume.endpoints[e].internalURL = volume.endpoints[e].region + "/volume" + volume.endpoints[e].internalURL.replace(/.*:[0-9]*/, "");
                }
            }
            
            image = JSTACK.Keystone.getservice("image");
            for (e in image.endpoints) {
                image.endpoints[e].adminURL = image.endpoints[e].region + "/image" + image.endpoints[e].adminURL.replace(/.*:[0-9]*/, "");
                image.endpoints[e].publicURL = image.endpoints[e].region + "/image" + image.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
                image.endpoints[e].internalURL = image.endpoints[e].region + "/image" + image.endpoints[e].internalURL.replace(/.*:[0-9]*/, "");
            }

            objectstorage = JSTACK.Keystone.getservice("object-store");
            if (objectstorage !== undefined) {
                for (e in objectstorage.endpoints) {
                    objectstorage.endpoints[e].adminURL = objectstorage.endpoints[e].region  + "/object-store" + objectstorage.endpoints[e].adminURL.replace(/.*:[0-9]*/, "");
                    objectstorage.endpoints[e].publicURL = objectstorage.endpoints[e].region  + "/object-store" + objectstorage.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
                    objectstorage.endpoints[e].internalURL = objectstorage.endpoints[e].region  + "/object-store" + objectstorage.endpoints[e].internalURL.replace(/.*:[0-9]*/, "");
                }
            }

            neutron = JSTACK.Keystone.getservice("network");
            if (neutron !== undefined) {
                for (e in neutron.endpoints) {
                    neutron.endpoints[e].adminURL = neutron.endpoints[e].region + "/network" + neutron.endpoints[e].adminURL.replace(/.*:[0-9]*/, "");
                    neutron.endpoints[e].publicURL = neutron.endpoints[e].region + "/network" + neutron.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
                    neutron.endpoints[e].internalURL = neutron.endpoints[e].region + "/network" + neutron.endpoints[e].internalURL.replace(/.*:[0-9]*/, "");
                }
            }
        }

    }

    return {
        initialize: initialize,
        goAuth: goAuth,
        logout: logout,
        authenticate: authenticate,
        authenticateWithCredentials: authenticateWithCredentials,
        getToken: getToken,
        getAccessToken: getAccessToken,
        getName: getName,
        isAuthenticated: isAuthenticated,
        getCurrentTenant: getCurrentTenant,
        getTenants: getTenants,
        getRegions: getRegions,
        updateRegionsStatus: updateRegionsStatus,
        getRegionStatus: getRegionStatus,
        getCurrentRegion: getCurrentRegion,
        switchRegion: switchRegion,
        switchTenant: switchTenant,
        isAdmin: isAdmin,
        isIDM: isIDM
    };

})(UTILS);

UTILS.Render = (function(U, undefined) {

    function animateRender(el, template, model, callback) {
        var temp = template(model);
        $(temp).hide();
        $(el).append(temp);
        //$(el).animate( {
        //                marginLeft: "+1250px",
        //                marginRight: "-1250px"
        //              }, 200, function() {
        //    temp = template(model);
            $(temp).show();
            $(el).html(temp).css('marginLeft', '1250px').css('marginRight', '-1250px').animate( {
                marginLeft: "-=1250px",
                marginRight: "+=1250px"
                      }, 200, function() {
                          if (callback !== undefined) {
                              callback();
                          }
                      });
        //    });
       return temp;
    }

    return {
        animateRender: animateRender
    };
})(UTILS);

UTILS.i18n = (function(U, undefined) {

    var dict = {
    };

    var params = {
        lang : "en",
        dict: dict
    };

    function init() {
        _.extend(_, {itemplate : function(html) {
            var simple = _.template(html);
            var func = function(args) {
                var init = simple(args);

                init = U.i18n.translate(init);
                return init;
            };
            return func;
        }});
        if (localStorage.i18nlang === undefined) {
            localStorage.i18nlang = 'en';
        }
        UTILS.i18n.setlang(localStorage.i18nlang);
        console.log("Language: " + localStorage.i18nlang);
    }

    function setlang(lang, callback) {
        var url = "locales/"+lang+".json?random=" + Math.random()*99999;
        $.ajax({
            url: url,
            success: function(data, status, xhr) {
                console.log('loaded: ' + url);
                U.i18n.params.dict = data;
                localStorage.i18nlang = lang;
                if (callback !== undefined)
                    callback();
            },
            error : function(xhr, status, error) {
                console.log('failed loading: ' + url);
                if (callback !== undefined)
                    callback();
            },
            dataType: "json"
        });
    }

    function translateNodes(el) {
        var html = $(el);
        var items = html.find("*[data-i18n]");
        items.each(function(index, item) {
            item = $(items[index], el);
            var newItem = U.i18n.get(item.attr("data-i18n"));
            if (newItem !== undefined) {
                var copy = item.clone();
                item.text(newItem);
                html.find(copy).replaceWith(item);
            }
        });
        return html;
    }

    function translate(html) {
        var initTime = new Date().getTime();
        html = translateNodes(html);
        var duration = new Date().getTime()-initTime;
        //console.log("Internationalization duration: " + duration);
        return html;
    }

    function pluralise(s, p, n) {
        var text = U.i18n.get(s);
        if (n != 1) text = U.i18n.get(p);
        var out = sprintf(text, n);
        return out;
    }

    function get(data) {
        var newItem = U.i18n.params.dict[data];
        if (newItem === undefined)
            newItem = data;
        return newItem;
    }

    function sprintf(s) {
        var bits = s.split('%');
        var out = bits[0];
        var re = /^([ds])(.*)$/;
        for (var i=1; i<bits.length; i++) {
            p = re.exec(bits[i]);
            if (!p || arguments[i]===null) continue;
            if (p[1] == 'd') {
                out += parseInt(arguments[i], 10);
            } else if (p[1] == 's') {
                out += arguments[i];
            }
            out += p[2];
        }
        return out;
    }

    return {
        params      :     params,
        init        :     init,
        setlang     :     setlang,
        translate   :     translate,
        get         :     get,
        pluralise   :     pluralise
    };
})(UTILS);

UTILS.i18n.init();

Utils.Me = (function(U, undefined) {
    var userInfo = JSTACK.Keystone.params.access.user;
    var user = new User({
        name: userInfo.name,
        id: userInfo.id
    });
    return user;
});

UTILS.Messages = (function(U, undefined) {
    var getCallbacks;
    
    getCallbacks = function (successMess, errorMess, options) {
        options = options || {};

        var check = function() {
            if (options) {
                if (options.context) {
                    options.context.close();
                }
                if (options.href) {
                    window.location.href = options.href;
                }
            }
        };

        var opt = {callback: function (resp) {
            check();
            if (options.showSuccessResp) {
                successMess = successMess + resp;
            }
            var subview = new MessagesView({state: "Success", title: successMess, el: options.el});
            subview.render();
            $('body').spin("modal");
            if (options.success) {
                options.success(resp);
            }
        }, error: function (model, error) {
            check();
            if (!error) {
                error = {message: 'unknow', body: ''};
            }
            var subview = new MessagesView({state: "Error", title: errorMess + ". Cause: " + error.message, info: error.body, el: options.el});
            subview.render();
            $('body').spin("modal");
            if (options.error) {
                options.error();
            }
        }};
        opt.success = opt.callback;

        $('body').spin("modal");

        if (options && options.context) {
            options.context.unbind();
            options.context.undelegateEvents();
        }

        return opt;
    };

    return {
        getCallbacks: getCallbacks
    };
})(UTILS);

UTILS.SM = (function(U, undefined) {
    var check, obj;

    // Private functions
    // -----------------

    // Function `_check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Nova service.
    check = function () {
        if (JSTACK.Keystone !== undefined &&
                JSTACK.Keystone.params.currentstate === JSTACK.Keystone.STATES.AUTHENTICATED) {
            return true;
        }
    };

    obj = {};
    var caller = function (funct) {
        return function() {
            if (!check()) {
                return;
            }
            JSTACK.Nova.params.service = "sm";
            JSTACK.Nova[funct].apply(this, arguments);
            JSTACK.Nova.params.service = "compute";
        };
    };
    for (var func in JSTACK.Nova) {
        if (typeof(JSTACK.Nova[func]) === "function" && func !== "Volume") {
            obj[func] = caller(func);
        }
    }

    return obj;
})(UTILS);

UTILS.DragDrop = (function(U, undefined) {
    var setData, getData, obj = {};
    setData = function(key, value) {
        obj[key] = value;
    };
    getData = function(key) {
        return obj[key];
    };
    clear = function() {
        obj = {};
    };
    return {
        setData : setData,
        getData : getData,
        clear   : clear
    };
})(UTILS);
