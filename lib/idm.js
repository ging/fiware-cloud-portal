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
        expires : undefined
    };

    var init = function () {
        params.access = undefined;
        params.token = undefined;
        params.expires = undefined;
        params.currentstate = STATES.DISCONNECTED;
    };

    function setToken(token, expires) {
        params.token = token;
        params.expires = expires;
    };

    var goAuth = function () {
        window.location.href = '/idm/auth';
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
        setToken: setToken
    };

}(IDM));