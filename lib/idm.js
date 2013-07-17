var IDM = IDM || {};

// Current version is **0.1**.

IDM.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
IDM.AUTHORS = 'GING';

IDM.Auth = (function (_IDM, undefined) {

    var params = {

    };

    var goAuth = function () {
        window.location.href = '/idm/auth';
    };

    var getTenants = function (callback) {

        //pedir los tenatns al idm
        
        var tenants = {tenants: [
            {description: "Test for FIWARE deployments. Guille", enabled: true, id: "980ae4606f464bb8bc214999c596b158", name: "FIWARE"},
            {description: "Test 2. Guille", enabled: true, id: "980ae4606f464bb8bc214999c596b158", name: "TESTI"}    
        ]};
        callback(tenants.tenants);
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
        goAuth: goAuth,
        getTenants: getTenants,
    };

}(IDM));