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
    
    function isAuthenticated() {
        return JSTACK.Keystone.params.currentstate == JSTACK.Keystone.STATES.AUTHENTICATED;
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
                tenants = resp.tenants.values;
                _tryTenant();
            }

            JSTACK.Keystone.gettenants(ok);
        }
        
        function _tryTenant() {
            if (tenants.length > 0) {
                var tenant = tenants.pop();
                console.log("Authenticating for tenant " + JSON.stringify(tenant.id));
                JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant.id, _authenticatedWithTenant, _error);
                return;
            }
            console.log("Error authenticating");
            error("No tenant")
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

    }

})(UTILS);

UTILS.Render = (function(U, undefined) {
    
    function animateRender(el, template, model) {
         $(el).animate( {
                        marginLeft: "+=1250px",
                        marginRight: "-=1250px",
                      }, 200, function() {
            $(el).empty().html(template(model)).css('marginLeft', '1250px').css('marginRight', '-1250px').animate( {
                        marginLeft: "-=1250px",
                        marginRight: "+=1250px",
                      }, 200);
            });
    };
    
    return {
        animateRender: animateRender
    }
})(UTILS);