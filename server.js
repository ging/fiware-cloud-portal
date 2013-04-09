var express = require('express'),
    http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy');

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var app = express();

app.use(express.bodyParser());

app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger());
    app.use(express.static(__dirname + '/'));
    //app.set('views', __dirname + '/../views/');
    //disable layout
    //app.set("view options", {layout: false});
});

/*app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});*/

function sendData(port, options, data, res) {
    var callback = function(response) {
        var str = '';
        res.statusCode = response.statusCode;
        res.headers = response.headers;
        try {
            res.setHeader('Content-Type', response.headers['content-type']);
            res.setHeader('Content-Length', response.headers['content-length']);
        } catch(err) {
            console.log("Error");
            return;
        }

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            res.send(str);
        });
    }
    console.log("Sending ", options.method, " to: " + options.host + ":" + options.port + options.path);
    var request = port.request(options, callback);
    request.setTimeout(10000, function() {
        //request.abort();
        res.statusCode = 500;
        res.send();
    });
    if (data) {
        console.log("Sending data");
        request.write(JSON.stringify(data));
    }
    request.end();
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

app.listen(8080);
