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

    var init = function () {
        params.access = undefined;
        params.token = undefined;
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

        // onOK = function (result) {
        //     params.currentstate = JS.Keystone.STATES.AUTHENTICATED;
        //     params.access = result.access;
        //     params.token = params.access.token.id;
        //     if (callback !== undefined) {
        //         callback(result);
        //     }
        // };

        // onError = function (message) {
        //     params.currentstate = STATES.AUTHENTICATION_ERROR;
        //     error(message);
        // };

        //sendRequest('', '', onOK, onError);

        params.token = '26fb8911728d49508295bcf556710b69';
        console.log('**** authenticated');
        callback();
    };

    var sendRequest = function (method, url, callback, callbackError) {

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
        req.send();

    };

    return {
        params: params,
        init: init,
        goAuth: goAuth,
        getTenants: getTenants,
        authenticate: authenticate
    };

}(IDM));