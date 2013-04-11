var express = require('express'),
    http = require('http'),
    https = require('https'),
    XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest;

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var app = express();

app.use(express.bodyParser());

app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger());
    app.use(express.static(__dirname + '/dist/'));
    //app.set('views', __dirname + '/../views/');
    //disable layout
    //app.set("view options", {layout: false});
});

app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, X-Auth-Token');
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

function sendData(port, options, data, res) {
    var xhr, body, result, callbackError, callBackOK;

    callbackError = callbackError || function(resp, headers) {
        console.log("Error: ", resp);
        res.statusCode = 500;
        res.send();
    };
    callBackOK = callBackOK || function(status, resp, headers) {
        res.statusCode = status;
        res.setHeader('Content-Type', headers['content-type']);
        res.setHeader('Content-Length', headers['content-length']);
        console.log("Response: ", status);
        res.send(resp);
    };

    var url = "http://" + options.host + ":" + options.port + options.path;
    xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true);
    if (options.method !== 'get') {
        xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.setRequestHeader("Accept", "application/json");
    for (var headerIdx in options.headers) {
        switch (headerIdx) {
            // Unsafe headers
            case "host":
            case "connection":
            case "referer":
            case "accept-encoding":
            case "accept-charset":
                break;
            default:
                xhr.setRequestHeader(headerIdx, options.headers[headerIdx]);
                break;
        }
    }

    xhr.onerror = function(error) {
        //callbackError({message:"Error", body:error});
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
                result = xhr.responseText
                callBackOK(xhr.status, result, xhr.getAllResponseHeaders());
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
}

app.all('/keystone/*', function(req, resp) {
    var options = {
        host: '130.206.80.100',
        port: 5000,
        path: req.url.split('keystone')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/keystone-admin/*', function(req, resp) {
    var options = {
        host: '130.206.80.100',
        port: 35357,
        path: req.url.split('keystone-admin')[1],
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.all('/nova/*', function(req, resp) {
    var options = {
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
        host: '130.206.80.112',
        port: 8080,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    sendData(http, options, req.body, resp);
});

app.listen(80);
