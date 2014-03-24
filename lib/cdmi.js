var CDMI = CDMI || {};
CDMI.VERSION = "0.1";
CDMI.AUTHORS = "GING";
CDMI.Rest = function (j, g) {
    var send;
    send = function (method, url, data, token, callBackOK, callbackError, headerType, options, mimetype) {
        var xhr, body, result;
        //fileAsBinary = new FileReader();
       // var fileToUpload = new File();

        // This function receives a `method` that can be "GET", "POST", "PUT", or
        // "DELETE". It also receives the `url` to which it has to send the request,
        // the `data` to be sent, that has to be a JSON object, the Â´tokenÂ´ to
        // authenticate the request, and success and error callbacks.
        var xhr = new XMLHttpRequest();
        var result = xhr.responseXML;
        xhr.open(method, url, true);
        if (headerType != undefined) {
            switch (headerType) {
                case 'container':
                    {
                        xhr.setRequestHeader("Content-Type", "application/cdmi-container");
                        xhr.setRequestHeader("Accept", "application/json");
                        xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.1");
                        break;
                    }
                case 'object':
                    {
                        xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                        xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.1");
                        data = JSON.stringify({
                         "mimetype" : mimetype,
                         "metadata" : { },
                         "valuetransferencoding" : "base64",
                         "value" : data
                        });
                        xhr.setRequestHeader("Accept", "application/json, application/octet-stream, application/cdmi-object");
                        break;
                    }
                case 'json':
                    {
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.setRequestHeader("Accept", "application/json");
                        break;
                    } 
                default:                    
                        xhr.setRequestHeader("Accept", "application/json");                     
                    
            }           
        }
        xhr.onreadystatechange = function () {
        
            if (xhr.readyState === 4) {
                switch (xhr.status) {

                // In case of successful response it calls the `callbackOK` function.
                case 100:
                case 200:
                    if (options === 'download') {
                        if (xhr.responseText !== undefined && xhr.responseText !== '') {
                            //xhr.AddHeader("Content-Disposition", "attachment; filename=\""+ options.name + "\"");
                            callBackOK(xhr.responseText);
                            break;
                        }                       
                    }

                case 201:
                case 202:
                case 203:
                case 204:
                case 205:   
                    result = undefined;
                    if (xhr.responseText !== undefined && xhr.responseText !== '') {
                        try {
                            result = JSON.parse(xhr.responseText);
                        } catch (e) {
                            result = {};
                        }
                    }
                    callBackOK(result);
                    break;

                // In case of error it sends an error message to `callbackError`.
                case 400:
                    callbackError("400 Bad Request");
                    break;
                case 401:
                    callbackError("401 Unauthorized");
                    break;
                case 403:
                    callbackError("403 Forbidden");
                    break;
                default:
                    callbackError(xhr.status + " Error");
                }
            }
        };

        if (token !== undefined) {
            xhr.setRequestHeader('X-Auth-Token', token);
        }
        
        if (data !== undefined) {
            body = JSON.stringify(data);
            xhr.send(body);
        } else {
            xhr.send();
        }

    };
    return {
        get: function (i,
            b, a, c, d, e) {
            send("GET", i, g, b, a, c, d, e)
        },
        post: function (i, b, a, c, d, e) {
            send("POST", i, b, a, c, d, e)
        },
        put: function (i, b, a, c, d, e, t) {
            send("PUT", i, b, a, c, d, e, undefined, t)
        },
        del: function (i, b, a, c, d) {
            send("DELETE", i, g, b, a, c, d)
        }
    }
}(CDMI);
CDMI.Actions = function (j, g) {
    var h, check;
    h = {
        url: g,
        state: g,
        endpointType: "publicURL"
    };
    check = function (region) {
        if (JSTACK.Keystone !== g && JSTACK.Keystone.params.currentstate === JSTACK.Keystone.STATES.AUTHENTICATED) {
            var service = JSTACK.Keystone.getservice("object-store");
            if (service) {
                h.url = JSTACK.Comm.getEndpoint(service, region, h.endpointType);
                return true;
            }
            return false;
        }
        return false;
    };
    return {
        params: h,
        check: check,
        getcontainerlist: function (b, error, region) {
            var a, c;
            check(region) && (a = function (a) {
                b !== g && b(a)
            }, c = function (a) {
                error(a);
            }, j.Rest.get(h.url, JSTACK.Keystone.params.token, a, c, "container", void 0))
        },
        createcontainer: function(name, callback, error, region) {
            var url, onOK, onError, data;
            console.log("Creating Container in CDMI");
            if (!check(region)) {
                return;
            }
            url = h.url + "/" + name;
            data = {
                metadata : {}
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
            console.log("PUT ", url, " data ", data, " token ", JSTACK.Keystone.params.token);
            j.Rest.put(url, data, JSTACK.Keystone.params.token, onOK, onError, "container");
        },
        deletecontainer: function (b, a, error, region) {
            var c, d, e;
            check(region) && (c = h.url + "/" + b, d = function (b) {
                a !== g && a(b)
            }, e = function (a) {
                error(a);
            }, j.Rest.del(c, JSTACK.Keystone.params.token, d, e, "container"))
        },
        getobjectlist: function (b, a, error, region) {
            var c, d, e;
            check(region) && (c = h.url + "/" + b, d = function (b) {
                a !== g && a(b)
            }, e = function (a) {
                error(a);
            }, j.Rest.get(c, JSTACK.Keystone.params.token,
                d, e, "object", void 0))
        },
        copyobject: function (b, a, c, d, e, error, region) {
            var g;
            check(region) && (g = h.url + "/" + c + "/" + d, b = h.url + "/" + b + "/" + a, a = function (a) {
                onOKCallback = function (a) {
                    void 0 !== e && e(a)
                };
                onErrorCallback = function (a) {
                    throw Error(a);
                };
                j.Rest.put(g, a, JSTACK.Keystone.params.token, onOKCallback, onErrorCallback, "object")
            }, c = function (a) {
                error(a);
            }, j.Rest.get(b, JSTACK.Keystone.params.token, a, c, "object", "download"))
        },
        uploadobject: function (b, a, c, t, d, error, region) {
            var e;
            check(region) && (b = h.url + "/" + b + "/" + a, a = function (a) {
                d !== g && d(a)
            }, e = function (a) {
                error(a);
            }, j.Rest.put(b, c, JSTACK.Keystone.params.token, a, e, "object", t))
        },
        downloadobject: function (b, a, c, error, region) {
            var d, e;
            check(region) && (d = h.url + "/" + b + "/" + a, a = function (a) {
                c !== g && c(a)
            }, e = function (a) {
                error(a);
            }, j.Rest.get(d, JSTACK.Keystone.params.token, a, e, "object", "download"))
        },
        deleteobject: function (b, a, c, error, region) {
            var d;
            check(region) && (b = h.url + "/" + b + "/" + a, a = function (a) {
                c !== g && c(a)
            }, d = function (a) {
                error(a);
            }, j.Rest.del(b, JSTACK.Keystone.params.token, a, d, "container"))
        }
    }
}(CDMI);
