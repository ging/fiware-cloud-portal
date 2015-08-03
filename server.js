var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    crypto = require('crypto'),
    XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest,
    OAuth2 = require('./oauth2').OAuth2,
    config = require('./config')
    cluster = require ('cluster');

var oauth_config = config.oauth;
var useIDM = config.useIDM;
var keystone_config = config.keystone;

var service_catalog, my_token;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (config.http_port === undefined || config.http_port === null) {
    console.log("HTTP port was not provided. Please, fill config.http_port in the configuration file");
    process.exit(1);
} else if (config.https === undefined || config.https === null) {
    console.log("HTTPS was not enabled or disabled. Please, fill config.https in the configuration file");
    process.exit(1);
}

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

    if (req.path === '/vnc_display') {
        var url = req.cookies['vnc_url'];
        delete req.cookies['vnc_url'];
        res.clearCookie('vnc_url');
        res.render('vnc', {vncUrl: url});
        return;
    }

    // Filter unsecure requests.
    if (config.https.enabled && req.protocol !== "https") {
        var fullUrl = 'https://' + req.get('host') + ':' + config.https.port + req.originalUrl;
        res.redirect(fullUrl);
        return;
    }

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
    app.use('/css', express.static(__dirname + dirName + 'css'));
    app.set('views', __dirname + '/views/');
    //disable layout
    //app.set("view options", {layout: false});
});

app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'HEAD, PUT, POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, X-Subject-Token, X-Auth-Token, Tenant-ID, x-image-meta-is_public, x-image-meta-name');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
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
        //console.log("Error: ", status, resp);
        res.statusCode = status;
        if (res.time_stats && config.time_stats_logger) {
            var interT = (new Date().getTime()) - res.time_stats.initT;
            var st = res.time_stats.reg + ' - ' + res.time_stats.serv + ' - ' + interT + ' - ERROR - ' + status;
            console.log('TIME_STAT -- ', st);
        }
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

        if (res.time_stats && config.time_stats_logger) {
            var interT = (new Date().getTime()) - res.time_stats.initT;
            var st = res.time_stats.reg + ' - ' + res.time_stats.serv + ' - ' + interT;
            console.log('TIME_STAT -- ', st);
        }
        res.send(resp);
    };

    var url = options.url || port + "://" + options.host + ":" + options.port + options.path;
    xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true);
    if (options.headers["content-type"]) {
        xhr.setRequestHeader("Content-Type", options.headers["content-type"]);
    }
    xhr.setRequestHeader("Connection", "Keep-Alive");

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
                console.log("Error sending req to ", url, " - ", xhr.status);
                callbackError(xhr.status, xhr.responseText);
            }
        }
    };

    var flag = false;
    if (data !== undefined && data !== null && data !== "") {
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
  res.render('index', {useIDM: useIDM, account_server: oauth_config.account_server, portals: config.fiportals, keystone_version: keystone_config.version});
});

app.get('/vnc', function(req, res) {
    res.cookie('vnc_url', req.query.url);
    var fullUrl = 'http://cloud.lab.fiware.org/vnc_display';
    res.redirect(fullUrl);
});

app.all('/terms_app/*', function(req, res) {
    var options = {
        host: 'terms.lab.fiware.org',
        port: 80,
        path: req.url.split('terms_app')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData("http", options, undefined, res);
});


app.all('/keystone/*', function(req, resp) {

    if (config.time_stats_logger) {
        resp.time_stats  = {serv: 'keystone', initT: (new Date()).getTime()};
    }

    if (req.url.split('keystone')[1] === '/v3/auth/tokens' && req.method === 'GET') {
        req.headers['x-subject-token'] = req.headers['x-auth-token'];
        req.headers['x-auth-token'] = my_token;
    }

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

    if (config.time_stats_logger) {
        resp.time_stats  = {serv: 'keystone-admin', initT: (new Date()).getTime()};
    }

    var options = {
        host: keystone_config.admin_host,
        port: keystone_config.admin_port,
        path: req.url.split('keystone-admin')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData("http", options, req.body, resp);
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

app.all('/:reg/:service/:v/*', function(req, resp) {

    if (config.time_stats_logger) {
        resp.time_stats  = {serv: req.params.service, reg:req.params.reg, initT: (new Date()).getTime()};
    }

    if (req.params.service === 'monitoring') {
        req.params.reg = 'Spain2';
    }


    var endp = getEndpoint(req.params.service, req.params.reg);
    var new_url = req.url.split(req.params.v)[1];
    var isSecure = endp.indexOf("https://") === 0;
    var options = {
        url: endp + new_url,
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false,
        requestCert: false
    };
    var protocol = isSecure ? "https": "http";
    sendData(protocol, options, req.body, resp);
});

app.all('/*', function(req, res) {
    console.log("------ Unknown request ", req.url);
});

app.all('/user/:token', function(req, resp) {

    if (config.time_stats_logger) {
        resp.time_stats  = {serv: 'token', initT: (new Date()).getTime()};
    }

    var options = {
        host: 'account.lab.fiware.org',
        port: 443,
        path: '/user?access_token=' + req.params.token,
        method: 'GET',
        headers: {}
    };

    sendData("https", options, undefined, resp);
});

function getCatalog(chained) {

    var options = {
        host: keystone_config.host,
        port: keystone_config.port,
        path: keystone_config.version === 3 ? '/v3/auth/tokens' : '/v2.0/tokens',
        method: 'POST',
        headers: {"Content-Type": "application/json"}
    };

    if (keystone_config.version === 3) {

        var credentials = {
            "auth": {
                "identity": {
                    "methods": [
                        "password"
                    ],
                    "password": {
                        "user": {
                            "domain": {
                                "id": "default"
                            },
                            "name": keystone_config.username,
                            "password": keystone_config.password
                        }
                    }
                }
            }
        };

    } else {
        var credentials = {
            "auth" : {
                "passwordCredentials" : {
                    "username" : keystone_config.username,
                    "password" : keystone_config.password
                },
                "tenantId": keystone_config.tenantId
            }
        };        
    }


    sendData("http", options, JSON.stringify(credentials), undefined, function (status, resp, headers) {


        if (keystone_config.version === 3) {
            service_catalog = JSON.parse(resp).token.catalog;
            my_token = headers['x-subject-token'];
            //console.log('Service catalog: ', JSON.stringify(service_catalog, 4, 4));

        } else {
            service_catalog = JSON.parse(resp).access.serviceCatalog;
        }
        //console.log('Service catalog: ', JSON.stringify(service_catalog, 4, 4));
        if (chained !== false) {
            setInterval(function() {
                getCatalog(false);
            }, 600000);
        }
    }, function (e, msg) {
        console.log('Error getting catalog', e, msg);
        setTimeout(function() {
            getCatalog(true);
        }, 10000);
    });
}

function getEndpoint (service, region) {
    var serv, endpoint;

    


    for (var s in service_catalog) {
        if (service_catalog[s].type === service) {
            serv = service_catalog[s];
            break;
        }
    }

    if (keystone_config.version === 3) {
        for (var e in serv.endpoints) {
            if (serv.endpoints[e].region === region && serv.endpoints[e].interface === 'public') {
                endpoint = serv.endpoints[e].url;
                break;
            }
        }
    } else {
        for (var e in serv.endpoints) {
            if (serv.endpoints[e].region === region) {
                endpoint = serv.endpoints[e].publicURL;
                break;
            }
        }
    }

    if (endpoint.match('/' + keystone_config.tenantId)) {
        return endpoint.split('/' + keystone_config.tenantId)[0];
    } else if (endpoint.match('/AUTH_' + keystone_config.tenantId)) {
        return endpoint.split('/AUTH_' + keystone_config.tenantId)[0];
    }
    var end = endpoint;
    
    if (end.charAt(end.length-1) === "/") {
        end = end.substring(0, end.length-1);
    }

    if (service === 'network') {
        end = end + "/v2.0";
    }
    if (service === 'application_catalog') {
        end = end + "/v1";
    }
    return end;
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

var available_cores = require('os').cpus().length;
var cores_to_use = config.max_cores || 1;

if (config.max_cores === 0 || config.max_cores > available_cores) {
    cores_to_use = available_cores;
}

if (cluster.isMaster) {
    for (var i = 0; i < cores_to_use; i++) {
        cluster.fork();
    }
} else {

    app.listen(config.http_port, undefined, null, function() {

        // Listen on HTTPS port. We need to have cert and key files to serve HTML files on SSL.
        if (config.https.enabled === true) {
            // This line is from the Node.js HTTPS documentation.
            var options = {
              key: fs.readFileSync(config.https.key_file),
              cert: fs.readFileSync(config.https.cert_file)
            };

            https.createServer( options, function(req,res)
            {
                app.handle( req, res );
            } ).listen( config.https.port );
        }

        console.log("Port ", config.http_port, " opened. Changing to unprivileged user...");
        try {
            process.setgid(config.process_user);
            process.setuid(config.process_group);
            console.log("The process now runs as user ", config.process_user);
        } catch (err) {
            console.log('WARNING: The server has too much privileges. Change config file to set an unprivileged user.');
        }
    });



    getCatalog(true);
}
