var express = require('express'),
    http = require('http'),
    https = require('https'),
    XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest;

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var app = express();

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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, X-Auth-Token, Tenant-ID');
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

function sendData(port, options, data, res) {
    var xhr, body, result, callbackError, callBackOK;

    callbackError = callbackError || function(status, resp) {
        console.log("Error: ", status, resp);
        res.statusCode = status;
        res.send(resp);
    };
    callBackOK = callBackOK || function(status, resp, headers) {
        res.statusCode = status;
        for (var idx in headers) {
            var header = headers[idx];
            res.setHeader(idx, headers[idx]);
        }
        console.log("Response: ", status);
        res.send(resp);
    };

    var url = "http://" + options.host + ":" + options.port + options.path;
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
            case "content-length":
            case "origin":
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

app.all('/keystone/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.100',
        port: 5000,
        path: req.url.split('keystone')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData(http, options, req.body, resp);
});

app.all('/keystone-admin/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.100',
        port: 35357,
        path: req.url.split('keystone-admin')[1],
        method: req.method,
        headers: getClientIp(req, req.headers)
    };
    sendData(http, options, req.body, resp);
});

app.all('/nova/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.11',
        port: 8774,
        path: req.url.split('nova')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/nova-volume/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.11',
        port: 8776,
        path: req.url.split('nova-volume')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/glance/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.11',
        port: 9292,
        path: req.url.split('glance')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/sm/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        host: '130.206.80.91',
        port: 8774,
        path: req.url.split('sm')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/sdc/rest/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        //host: '130.206.80.112',
        //host: '130.206.80.119',
        host: '130.206.82.161',
        port: 8080,
        //port: 8081,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/paasmanager/rest/*', function(req, resp) {
    var options = {
        //host: '130.206.80.63',
        //host: '130.206.80.112',
        host: '130.206.82.160',
        port: 8080,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.listen(80);
