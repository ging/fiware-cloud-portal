var express = require('express'),
    http = require('http'),
    https = require('https'),
    crypto = require('crypto'),
    XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest,
    OAuth2 = require('./oauth2').OAuth2;

var oauth_config = require('./config').oauth;
var useIDM = require('./config').useIDM;
var keystone_config = require('./config').keystone;

var service_catalog;

if (useIDM) {
    var oauth_client = new OAuth2(oauth_config.client_id,
                    oauth_config.client_secret,
                    oauth_config.account_server,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    oauth_config.callbackURL);
}


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var app = express();

var secret = "adeghskdjfhbqigohqdiouka";
app.use(express.cookieParser());
app.use(express.session({
    secret: secret, 
    cookie: { secure: true }
}));

//app.use(express.bodyParser());

app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

var dirName = '/dist/';
if (process.argv[2] === 'debug') {
    console.log('********* debug');
    dirName = '/';
}

app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger());
    app.use(express.static(__dirname + dirName));
    //app.set('views', __dirname + '/../views/');
    //disable layout
    //app.set("view options", {layout: false});
});

app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'HEAD, PUT, POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, X-Auth-Token, Tenant-ID');
    res.header('Access-Control-Allow-Credentials', true);
    console.log("New Request: ", req.method);
    if (req.method == 'OPTIONS') {
        console.log("CORS request");
        res.statusCode = 200;
        res.header('Content-Length', '0');
        res.send();
        res.end();
    }
    else {
        next();
    }
});

function sendData(port, options, data, res, callBackOK, callbackError) {
    var xhr, body, result;

    callbackError = callbackError || function(status, resp) {
        console.log("Error: ", status, resp);
        res.statusCode = status;
        res.send(resp);
    };
    callBackOK = callBackOK || function(status, resp, headers) {
        res.statusCode = status;
        for (var idx in headers) {
            var header = headers[idx];
            if (idx !== 'Cookie' && idx !== 'User-Agent') {
              res.setHeader(idx, headers[idx]);
            }
        }
        console.log("Response: ", status);
        res.send(resp);
    };

    var url = options.url || port + "://" + options.host + ":" + options.port + options.path;
    xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true);
    if (options.headers["content-type"]) {
        xhr.setRequestHeader("Content-Type", options.headers["content-type"]);
    }
    for (var headerIdx in options.headers) {
        switch (headerIdx) {
            // Unsafe headers
            case "host":
            case "connection":
            case "referer":
            case "accept-encoding":
            case "accept-charset":
            case "cookie":
            case "Cookie":
            case "content-length":
            case "origin":
            case "user-agent":
                break;
            default:
                xhr.setRequestHeader(headerIdx, options.headers[headerIdx]);
                break;
        }
    }

    xhr.onerror = function(error) {
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
                callBackOK(xhr.status, xhr.responseText, xhr.getAllResponseHeadersList());
                break;

            // In case of error it sends an error message to `callbackError`.
            default:
            if (callbackError)
                callbackError(xhr.status, xhr.responseText);
            }
        }
    };

    var flag = false;
    console.log("Sending ", options.method, " to: " + url);
    if (data !== undefined) {
        try {
            xhr.send(data);
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
}

function getClientIp(req, headers) {
  var ipAddress = req.connection.remoteAddress;

  var forwardedIpsStr = req.header('x-forwarded-for');

  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    forwardedIpsStr += "," + ipAddress;
  } else {
    forwardedIpsStr = "" + ipAddress;
  }

  headers['x-forwarded-for'] = forwardedIpsStr;

  return headers;
};

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { useIDM: useIDM })
});

app.all('/keystone/*', function(req, resp) {
    var options = {
        host: keystone_config.host,
        port: keystone_config.port,
        path: req.url.split('keystone')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData("http", options, req.body, resp);
});

app.all('/keystone-admin/*', function(req, resp) {
    var options = {
        host: keystone_config.admin_host,
        port: keystone_config.admin_port,
        path: req.url.split('keystone-admin')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData("http", options, req.body, resp);
});

app.all('/:reg/:service/:v/*', function(req, resp) {

    var endp = getEndpoint(req.params.service, req.params.reg);
    var new_url = req.url.split(req.params.v)[1];
    console.log('REGION: ', req.url, endp, new_url);
    if (endp.charAt(endp.length-1) === "/") {
        endp = endp.substring(0, endp.length-1) + "/v2.0";
    }
        
    console.log('REGION: ', req.params.reg, endp, new_url);

    var options = {
        url: endp + new_url,
        method: req.method,
        headers: req.headers
    };
    sendData("http", options, req.body, resp);
});

app.all('/user/:token', function(req, resp) {
    var options = {
        host: 'account.lab.fi-ware.eu',
        port: 443,
        path: '/user?access_token=' + req.params.token,
        method: 'GET',
        headers: {}
    };

    sendData("https", options, undefined, resp);
});

if (useIDM) {
    app.get('/idm/auth', function(req, res){

        var tok;

        try {
            tok = decrypt(req.cookies.oauth_token);
        } catch (err) {
            req.cookies.oauth_token = undefined;
        }

        if(!req.cookies.oauth_token) {
            var path = oauth_client.getAuthorizeUrl();
            res.redirect(path);
        } else {
            res.redirect("/#token=" + tok + "&expires=" + req.cookies.expires_in);
        }
        
    });

    app.get('/login', function(req, res){
       
        oauth_client.getOAuthAccessToken(
            req.query.code,
            function (e, results){
                res.cookie('oauth_token', encrypt(results.access_token));
                res.cookie('expires_in', results.expires_in);
                res.redirect("/#token=" + results.access_token + "&expires=" + results.expires_in);
            });

    });

    app.get('/logout', function(req, res){
        res.clearCookie('oauth_token');
        res.clearCookie('expires_in');
        res.send(200);
    });
}

function getCatalog() {

    var options = {
        host: keystone_config.host,
        port: keystone_config.port,
        path: '/v2.0/tokens',
        method: 'POST',
        headers: {"Content-Type": "application/json"}
    };

    var credentials = {
                "auth" : {
                    "passwordCredentials" : {
                        "username" : keystone_config.username,
                        "password" : keystone_config.password
                    },
                    "tenantId": keystone_config.tenantId
                }
            };

    sendData("http", options, JSON.stringify(credentials), undefined, function (status, resp) {
        service_catalog = JSON.parse(resp).access.serviceCatalog;
        console.log('CAT ', getEndpoint("network", "RegionOne"));
    }, function (e, msg) {
        console.log('Error ', e, msg);
    });
}

function getEndpoint (service, region) {
    var serv, endpoint;
    for (var s in service_catalog) {
        console.log(service_catalog[s].type, service);
        if (service_catalog[s].type === service) {
            serv = service_catalog[s];
            break;
        }
    }
    for (var e in serv.endpoints) {
        if (serv.endpoints[e].region === region) {
            endpoint = serv.endpoints[e];
            break;
        }
    }
    if (endpoint.publicURL.match(keystone_config.tenantId)) {
        return endpoint.publicURL.split('/' + keystone_config.tenantId)[0];
    }
    return endpoint.publicURL;
}

function encrypt(str){
  var cipher = crypto.createCipher('aes-256-cbc',secret);
  var crypted = cipher.update(str,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(str){
  var decipher = crypto.createDecipher('aes-256-cbc',secret);
  var dec = decipher.update(str,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

app.listen(80);

getCatalog();