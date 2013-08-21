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

    var pad = function(number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    };
    var getTenants = function (token, callback) {

        sendRequest("GET", "/user/" + token, undefined, function(resp) {
            var response = JSON.parse(resp);

            for (var orgIdx in response.organizations) {
                var org = response.organizations[orgIdx];
                org.id = pad(org.id, 32);
                org.name = org.displayName;
            }

            var myOrg = {
                   id: pad(response.actorId, 32),
                   name: response.nickName,
                   roles: [
                            {"id": "8db87ccbca3b4d1ba4814c3bb0d63aab", "name": "Member"},
                            {"id": "09e95db0ea3f4495a64e95bfc64b0c55", "name": "admin"}
                        ]
                };

            if (response.organizations === undefined) {
                response.organizations = [];
            };

            response.organizations.push(myOrg);

            //console.log(response);
            callback(response.organizations);
        });
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