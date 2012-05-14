var UTILS = UTILS || {};

// Current version is **0.1**.

UTILS.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
UTILS.AUTHORS = 'GING';

UTILS.Auth = (function(U, undefined) {

    var tenants = [];
    
    function initialize(url) {
        JSTACK.Keystone.init(url);
    }
    
    function getToken() {
        return JSTACK.Keystone.params.token;
    }
    
    function getName() {
        return JSTACK.Keystone.params.access.user.name;
    }
    
    function getTenants(callback) {
        return JSTACK.Keystone.gettenants(function(resp) {
            callback(resp.tenants);
        });
    }
    
    var getCurrentTenant = function() {
        return JSTACK.Keystone.params.access.token.tenant;
    }
    
    var isAuthenticated = function() {
        return JSTACK.Keystone.params.currentstate == JSTACK.Keystone.STATES.AUTHENTICATED;
    }
    
    var isAdmin = function() {
        var roles = JSTACK.Keystone.params.access.user.roles;
        for (var index in roles) {
            var rol = roles[index];
            if (rol.name == "admin")
            return true;
        }
        return false;
    }
    
    var switchTenant = function(tenant, callback, error) {
        JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant, callback, error);
    }

    function authenticate(username, password, tenant, token, callback, error) {
        
        var _authenticatedWithTenant = function (resp) {
            console.log("Authenticated");
            console.log(JSON.stringify(resp));
            callback();
        }
        
        var _authenticatedWithToken = function (resp) {
            console.log("Authenticated");
            callback();
        }

        var _authenticatedWithoutTenant = function() {
            console.log("Ok");
            console.log("Retrieving tenants...");

            var ok = function (resp) {
                tenants = resp.tenants;
                _tryTenant();
            }

            JSTACK.Keystone.gettenants(ok);
        }
        
        var _tryTenant = function(tenant) {
            if (tenants.length > 0) {
                tenant = tenant || tenants.pop();
                console.log("Authenticating for tenant " + JSON.stringify(tenant.id));
                JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant.id, _authenticatedWithTenant, _error);
            } else {
                console.log("Error authenticating");
                error("No tenant")
            }
        }
        
        
        var getToken = function() {
            return JSTACK.Keystone.params.token;
        }
        
        var onError = function(msg) {
            error(msg);
        }

        var _error = function() {
            _tryTenant();
        }
        
        var _credError = function() {
            error("Bad credentials");
        }
        
        var success;
        
        if (tenant != undefined) {
            success = _authenticatedWithTenant;
            console.log("Authenticating with tenant");
        } else if (username != password) {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating without tenant");
        } else if (token != undefined) {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating with token");
        }
        JSTACK.Keystone.authenticate(username, password, token, tenant, success, _credError);
    };
    
    return {
        initialize: initialize,
        authenticate: authenticate,
        getToken: getToken,
        getName: getName,
        isAuthenticated: isAuthenticated,
        getCurrentTenant: getCurrentTenant,
        getTenants: getTenants,
        switchTenant: switchTenant,
        isAdmin: isAdmin
    }

})(UTILS);

UTILS.Render = (function(U, undefined) {
    
    function animateRender(el, template, model) {
         $(el).animate( {
                        marginLeft: "+1250px",
                        marginRight: "-1250px",
                      }, 200, function() {
            $(el).empty().html(template(model)).css('marginLeft', '1250px').css('marginRight', '-1250px').animate( {
                marginLeft: "-=1250px",
                marginRight: "+=1250px",
                      }, 200);
            });
    }
    
    return {
        animateRender: animateRender
    }
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
	            var init = simple(args)

	            init = U.i18n.translate(init);
	            return init;
	        }
	        return func;
	    }});
        
    };
    
    function setlang(lang, callback) {
        var url = "locales/"+lang+".json?random=" + Math.random()*99999;
        $.ajax({
            url: url,
            success: function(data, status, xhr) {
                console.log('loaded: ' + url);
                U.i18n.params.dict = data;
                if (callback != undefined)
                    callback();
            },
            error : function(xhr, status, error) {
                console.log('failed loading: ' + url);
                console.log(error);
                console.log(status);
                if (callback != undefined)
                    callback();
            },
            dataType: "json"
        });
    }
    
    function translateNodes(el) {
        var html = $(el);
        var items = html.find("*[data-i18n]");
        items.each(function(index, item) {
            var item = $(items[index], el);
            var newItem = U.i18n.params.dict[item.attr("data-i18n")];
            if (newItem != undefined) {
                var copy = item.clone();
                item.text(newItem);
                html.find(copy).replaceWith(item);
            }
        });
        return html;
    };
    
    function translate(html) {
        html = translateNodes(html);
        return html;
    }
    
    return {
        params      :     params,
        init        :     init,
        setlang     :     setlang,
        translate   :     translate
    }
})(UTILS);