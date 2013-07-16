var IDM = IDM || {};

// Current version is **0.1**.

IDM.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
IDM.AUTHORS = 'GING';

IDM.Auth = (function (_IDM, undefined) {



    var STATES = {
        DISCONNECTED : 0,
        AUTHENTICATING : 1,
        AUTHENTICATED : 2,
        AUTHENTICATION_ERROR : 3
    };

    var params = {
        currentstate : undefined,
        access : undefined,
        token : undefined,
    };

    var init = function (url, adminUrl) {
        params.url = url;
        params.adminUrl = adminUrl;
        params.access = undefined;
        params.token = undefined;
        params.services = {};
        params.currentstate = STATES.DISCONNECTED;
    };

    var goAuth = function () {
        window.location.href = '/idm/auth';
    };

    var getTenants = function (callback) {

        //pedir los tenatns al idm
        

        var tenants = [{description: "Test for FIWARE deployments. Guille", enabled: true, id: "980ae4606f464bb8bc214999c596b158", name: "FIWARE"}];
        params.currentTenant = tenants[0];
        callback(tenants);
    };

    var authenticate = function (access_token, tenant, callback, error) {


        var onOK, onError;

        //User also can provide a `tenant`.
        if (tenant !== undefined) {
            var tenants = [{description: "Test for FIWARE deployments. Guille", enabled: true, id: "980ae4606f464bb8bc214999c596b158", name: "FIWARE"}];
            params.currentTenant = tenants[0];
        }

        // During authentication the state will be `AUTHENTICATION`.
        params.currentstate = STATES.AUTHENTICATING;

        onOK = function (result) {
            params.currentstate = STATES.AUTHENTICATED;
            params.access = JSON.parse(result).access;
            params.token = params.access.token.id;

            var serviceCatalog = params.access.serviceCatalog;
            for (var ser in serviceCatalog) {
                params.services[serviceCatalog[ser].type] = serviceCatalog[ser];
            }

            if (callback !== undefined) {
                console.log('**** authenticated');
                callback(JSON.parse(result));
            }
        };

        onError = function (message) {
            params.currentstate = STATES.AUTHENTICATION_ERROR;
            error(message);
        };

        var body = {access_token: access_token, tenant: tenant};

        sendRequest('POST', params.url + 'tokens', JSON.stringify(body), onOK, onError);

    };

    var sendRequest = function (method, url, body, callback, callbackError) {

        var req = new XMLHttpRequest();

        req.onreadystatechange = onreadystatechange = function () {

            if (req.readyState == '4') {

                switch (req.status) {

                    case 100:
                    case 200:
                    case 201:
                    case 202:
                    case 203:
                    case 204:
                    case 205:
                        //console.log('Respuesta: ', req.responseText);
                        callback(req.responseText);
                        break;
                    default:
                        callbackError({message:req.status + " Error", body:req.responseText});
                }
            }
        }

        req.open(method, url, true);

        req.setRequestHeader('Accept', 'application/xml');
        req.send(body);

    };

    return {
        params: params,
        init: init,
        goAuth: goAuth,
        getTenants: getTenants,
        authenticate: authenticate
    };

}(IDM));