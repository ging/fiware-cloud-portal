var PM = PM || {};
PM.VERSION = "0.1";
PM.AUTHORS = "GING";
PM.Comm = function (PM, undefined) {
    "use strict";

    var send, get, head, post, put, patch, del, getEndpoint;

    // Private functions
    // -----------------

    // Function `_send` is internally used to make detailed low-level requests
    // to components.
    send = function (method, url, data, token, callBackOK, callbackError, headers) {
        var xhr, body, result;

        callbackError = callbackError || function(resp) {
            //console.log("Error: ", resp);
        };
        callBackOK = callBackOK || function(resp, headers) {
            //console.log("OK: ", resp, headers);
        };

        // This function receives a `method` that can be "GET", "POST", "PUT", or
        // "DELETE". It also receives the `url` to which it has to send the request,
        // the `data` to be sent, that has to be a JSON object, the ´token´ to
        // authenticate the request, and success and error callbacks.
        xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        
        xhr.setRequestHeader("Accept", "application/json");
        if (token !== undefined) {
            xhr.setRequestHeader('X-Auth-Token', token);
        }
        var hasContent = false;
        if (headers) {
            for (var head in headers) {
                if (head === "Content-Type") hasContent = true;
                xhr.setRequestHeader(head, headers[head]);
                console.log("Header set: ", head, " - ", headers[head]);
            }
        }
        if (data && !hasContent) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.onerror = function(error) {
            callbackError({message:"Error", body:error});
        }
        xhr.onreadystatechange = function () {

            // This resolves an error with Zombie.js
            if (flag) {
                return;
            }

            if (xhr.readyState === 4) {
                flag = true;
                switch (xhr.status) {
                // In case of successful response it calls the `callbackOK` function.
                case 100:
                case 200:
                case 201:
                case 202:
                case 203:
                case 204:
                case 205:
                case 206:
                case 207:
                    result = undefined;
                    if (xhr.responseText !== undefined && xhr.responseText !== '') {
                        result = JSON.parse(xhr.responseText);
                    }
                    callBackOK(result, xhr.getAllResponseHeaders());
                    break;

                // In case of error it sends an error message to `callbackError`.
                default:
                    callbackError({message:xhr.status + " Error", body:xhr.responseText});
                }
            }
        };
        var flag = false;
        if (data !== undefined) {
            body = JSON.stringify(data);
            try {
                xhr.send(body);
            } catch (e) {
                //callbackError(e.message);
                return;
            }
        } else {
            try {
                xhr.send();
            } catch (e) {
                //callbackError(e.message);
                return;
            }
        }
    };

    // Public functions
    // ----------------

    // * Function *get* receives the `url`, the authentication token
    // (which is optional), and callbacks. It sends a HTTP GET request,
    // so it does not send any data.
    get = function (url, token, callbackOK, callbackError, headers) {
        send("get", url, undefined, token, callbackOK, callbackError);
    };
    // * Function *head* receives the `url`, the authentication token
    // (which is optional), and callbacks. It sends a HTTP HEAD request,
    // so it does not send any data.
    head = function (url, token, callbackOK, callbackError, headers) {
        send("head", url, undefined, token, callbackOK, callbackError);
    };
    // * Function *post* receives the `url`, the authentication token
    // (which is optional), the data to be sent (a JSON Object), and
    // callbacks. It sends a HTTP POST request.
    post = function (url, data, token, callbackOK, callbackError, headers) {
        send("POST", url, data, token, callbackOK, callbackError);
    };
    // * Function *put* receives the same parameters as post. It sends
    // a HTTP PUT request.
    put = function (url, data, token, callbackOK, callbackError, headers) {
        send("PUT", url, data, token, callbackOK, callbackError, headers);
    };
    // * Function *patch* receives the same parameters as post. It sends
    // a HTTP PATC request.
    patch = function (url, data, token, callbackOK, callbackError, headers) {
        headers["Content-Type"] = 'application/openstack-images-v2.1-json-patch';
        send("PATCH", url, data, token, callbackOK, callbackError, headers);
    };
    // * Function *del* receives the same paramaters as get. It sends a
    // HTTP DELETE request.
    del = function (url, token, callbackOK, callbackError, headers) {
        send("DELETE", url, undefined, token, callbackOK, callbackError);
    };

    getEndpoint = function (serv, region, type) {
        var endpoint;
        for (var e in serv.endpoints) {
            if (serv.endpoints[e].region === region) {
                endpoint = serv.endpoints[e][type];
                break;
            }
        }
        //if (!endpoint) endpoint = serv.endpoints[0][type];
        return endpoint;
    };

    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        get : get,
        head : head,
        post : post,
        put : put,
        patch: patch,
        del : del,
        getEndpoint: getEndpoint
    };
}(PM);

PM.Rest = (function (PM, undefined) {
    var params, getapiinfo, updatewindowsize, listservers, listserverrules, createrule, updaterule, deleterule, 
        getrule, createsubscription, deletesubscription, getsubscription;

    // This modules stores the `url`to which it will send every
    // request.
    params = {
        url : undefined,
        state : undefined,
        endpointType : "publicURL",
        service : "policy"
    };


    // Private functions
    // -----------------

    // Function `_check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Nova service.
    check = function (region) {
        if (JSTACK.Keystone !== undefined &&
                JSTACK.Keystone.params.currentstate === JSTACK.Keystone.STATES.AUTHENTICATED) {
            var service = JSTACK.Keystone.getservice(params.service);
            if (service) {
                params.url = JSTACK.Comm.getEndpoint(service, region, params.endpointType);
                return true;
            }
            return false;            
        }
        return false;
    };

    // Public functions
    // ----------------
    //

    // This function sets the endpoint type for making requests to Glance.
    // It could take one of the following values:
    // * "adminURL"
    // * "internalURL"
    // * "publicURL"
    // You can use this function to change the default endpointURL, which is publicURL.
    configure = function (endpointType) {
        if (endpointType === "adminURL" || endpointType === "internalURL" || endpointType === "publicURL") {
            params.endpointType = endpointType;
        }
    };

    // Get the information of the API
    // Response: 
    // {
    //  "owner": "TELEFONICA I+D",
    //  "windowsize": <windows_size>,
    //  "version": "<API_version>",
    //  "runningfrom": "<last_launch_date>
    //  "doc": "<URL_DOCUMENTATION>"
    // }
    getapiinfo = function (callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/';

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    // Update the window size
    updatewindowsize = function (windowsize, callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        data = {
            "windowsize": windowsize
        };

        url = params.url + '/';

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Get the list of all servers' rules
    // Response:
    // {
    //      "servers": [
    //           {
    //               "serverId": "<serverId>",
    //               "rules": [
    //                  {
    //                       "condition": <CONDITION_DESCRIPTION>,
    //                       "action": <ACTION_ON_SERVER>,
    //                       "ruleId": "<RULE_ID>"      
    //                  },
    //                  {
    //                       "condition": <CONDITION_DESCRIPTION>,
    //                       "action": <ACTION_ON_SERVER>,
    //                       "ruleId": "<RULE_ID>"      
    //                  }
    //               ]
    //           },
    //           {
    //               "serverId": "<serverId>",
    //               "rules": [
    //                  {
    //                       "condition": <CONDITION_DESCRIPTION>,
    //                       "action": <ACTION_ON_SERVER>,
    //                       "ruleId": "<RULE_ID>"      
    //                  },
    //                  {
    //                       "condition": <CONDITION_DESCRIPTION>,
    //                       "action": <ACTION_ON_SERVER>,
    //                       "ruleId": "<RULE_ID>"      
    //                  }
    //               ]
    //           }
    //       ]
    //  }
    // The values that you receive are the following:
    // * serverId is the key whose value specifies the server ID in the URI, following the OpenStack ID format. An example of it is the id 52415800-8b69-11e0-9b19-734f6af67565.
    // * condition is the key whose value is the description of the scalability rule associated to this server. It could be one or more than one and the format of this rule is the following:
    // * action is the key whose value represents the action to take over the server. Its values are up and down.
    // * ruleId is the key that represents the id of the rule, following the OpenStack Id format (e.g. 52415800-8b69-11e0-9b19-734f6f006e54).
    listservers = function (callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers';

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    // Get the list of all rules of a server
    // Response:
    // {
    //      "serverId": "<serverId>",
    //      "rules": [
    //                 {
    //                      "name": <NAME>,
    //                      "condition": <CONDITION_DESCRIPTION>,
    //                      "action": <ACTION_ON_SERVER>,
    //                      "ruleId": "<RULE_ID>"      
    //                 },
    //                 {
    //                      "name": <NAME>,
    //                      "condition": <CONDITION_DESCRIPTION>,
    //                      "action": <ACTION_ON_SERVER>,
    //                      "ruleId": "<RULE_ID>"      
    //                 }
    //      ]
    // }
    listserverrules = function (serverid, callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid;

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    // Create a new elasticity rule
    // Response:
    // {
    //     "serverId": <serverId>,
    //     "ruleId": <RULE_ID>
    //  }
    createrule = function (serverid, name, condition, action, callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/rules';

        // action can be email, up and down.
        data = {
            "name": name,
            "condition": condition,
            "action": action
         };

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Update an elasticity rule
    // Response:
    // {
    //     "name": <NAME>,
    //     "condition": <CONDITION_DESCRIPTION>,
    //     "action": <ACTION_ON_SERVER>
    //  }
    updaterule = function (serverid, ruleid, name, condition, action, callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/rules/' + ruleid;

        // action can be email, up and down.
        data = {
            "name": name,
            "condition": condition,
            "action": action
         };

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Delete an elasticity rule
    deleterule = function (serverid, ruleid, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/rules/' + ruleid;

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.del(url, JS.Keystone.params.token, onOK, onError);
    };

    // Get an elasticity rule
    // Response:
    // {
    //     "name": <NAME>,
    //     "condition": <CONDITION_DESCRIPTION>,
    //     "action": <ACTION_ON_SERVER>,
    //     "ruleId": "<RULE_ID>"
    //  }
    getrule = function (serverid, ruleid, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/rules/' + ruleid;

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    // Create a new subscription
    // Response:
    // {
    //     "subscriptionId": <SUBSCRIPTION_ID>
    //  }
    createsubscription = function (serverid, ruleid, subscriptionurl, callback, error, region) {
        var url, data, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/subscription/';

        data = {
            "ruleId": ruleid,
            "url": subscriptionurl
        };

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Delete a subscription
    deletesubscription = function (serverid, subscriptionid, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/subscription/' + subscriptionid;

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.del(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Get a subscription
    // Response:
    // {
    //     "subscriptionId": <SUBSCRIPTION_ID>,
    //     "url": <URL_TO_NOTIFY>,
    //     "serverId": <SERVER_ID>,
    //     "ruleId": "<RULE_ID>"      
    //  }
    getsubscription = function (serverid, subscriptionid, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + '/servers/' + serverid + '/subscription/' + subscriptionid;

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        PM.Comm.get(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // This is the list of available public functions and variables
    return {
        // Functions:
        configure: configure,
        getapiinfo : getapiinfo,
        updatewindowsize : updatewindowsize,
        listservers : listservers,
        listserverrules : listserverrules,
        createrule : createrule,
        updaterule: updaterule,
        deleterule : deleterule,
        getrule : getrule,
        createsubscription : createsubscription,
        deletesubscription : deletesubscription,
        getsubscription: getsubscription
    };
});
