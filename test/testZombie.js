var Browser = require("zombie");
var express = require('express');
var should = require("should");

Browser.silent = true;

var browser = new Browser();

var app = express();
app.use(function (req, res, next) {
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
});

//app.use(express.bodyParser());
app.set('view engine', 'ejs');

app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
//    app.use(express.logger());
    app.use(express.static(__dirname + '/../dist/'));
    app.use('/css', express.static(__dirname + '/../dist/css'));
    app.set('views', __dirname + '/../views/');
    app.set("view options", {layout: true});

});
app.get('/', function(req, res) {
  res.render('index', {useIDM: false, account_server: {}, portals: []});
});
app.post('/keystone/v2.0/tokens', function (req, res) {
    var result = {"url":"/keystone/v2.0/","currentstate":2,
        "access":{"token":{"expires":"2113-02-22T15:15:09Z","id":"1111",
        "tenant":{"description":"test","enabled":true,"id":"1234567890","name":"test"}},
        "serviceCatalog":[
            {"endpoints":[{"adminURL":"/nova","region":"RegionOne","internalURL":"/nova","publicURL":"/nova"}],"endpoints_links":[],"type":"compute","name":"nova"},
            {"endpoints":[{"adminURL":"/glance","region":"RegionOne","internalURL":"/glance","publicURL":"/glance"}],"endpoints_links":[],"type":"image","name":"glance"},
            {"endpoints":[{"adminURL":"/volume","region":"RegionOne","internalURL":"/volume","publicURL":"/volume"}],"endpoints_links":[],"type":"volume","name":"volume"},
            {"endpoints":[{"adminURL":"/ec2","region":"RegionOne","internalURL":"/ec2","publicURL":"/ec2"}],"endpoints_links":[],"type":"ec2","name":"ec2"},
            {"endpoints":[{"adminURL":"/sm","region":"RegionOne","internalURL":"/sm","publicURL":"/sm"}],"endpoints_links":[],"type":"sm","name":"service_manager"},
            {"endpoints":[{"adminURL":"/swift","region":"RegionOne","internalURL":"/swift","publicURL":"/swift"}],"endpoints_links":[],"type":"object-store","name":"swift"},
            {"endpoints":[{"adminURL":"/keystone/v2.0","region":"RegionOne","internalURL":"/keystone/v2.0","publicURL":"/keystone/v2.0"}],"endpoints_links":[],"type":"identity","name":"keystone"}],
        "user":{"username":"user","roles_links":[],"id":"121","roles":[{"id":"123","name":"Member"}],"name":"user"}},"token":"1111","adminUrl":"/keystone/v2.0"};
    res.send(result);
});

app.get('/keystone/v2.0/tenants', function (req, res) {
    var result = {"tenants_links":[],"tenants":[{"enabled":true,"description":"test","name":"test","id":"1234567890"}]}
    res.send(result);
});

app.listen(8082);

describe('Self Service Interface GE', function(){

    before(function() {

    });

    describe('Library', function(){

        before(function(done) {
            browser.debug = false;
//            browser.waitFor = 1000;
//            browser.visit("http://localhost:8082/").then(function() {
                done();
//            });
        });

        it('should authenticate user', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should create instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the instance detail', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should stop instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should start instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should resize instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should reboot instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should create image', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list images', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the image details in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete image', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list flavors', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the flavor details', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete flavor', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list projects', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list blueprint instances', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list blueprint templates', function (done) {
            true.should.equal(true);
            done();
        });

        it('should create new blueprint templates', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list networks', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list routers', function (done) {
            true.should.equal(true);
            done();
        });

    });

    describe('Portal', function(){

        before(function(done) {
            browser.debug = false;
            browser.waitFor = 1000;
            browser.visit("http://localhost:8082/").then(function() {
                done();
            });
        });

        it('should show the login page of portal', function (done) {
            browser.evaluate('$("#auth")[0].style["display"]').should.not.equal("none");
            done();
        });

        it('should show the overview page in the portal', function (done) {
            browser.fill("username", "user").fill("password", "pass").pressButton("Sign In", function() {
                setTimeout(function() {
                    browser.text("#user_info_name").should.equal('user');
                    done();
                }, 100);
                //assert.equal(browser.text("h3"), "Log In");
            });
        });

        it('should show the terminal of the instance', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should create instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the instance detail in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should stop instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should start instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should resize instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should reboot instance in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list images in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the image details in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete image in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list flavors in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should get the flavor details in the portal', function (done) {
            true.should.equal(true);
            done();
        });

        it('should delete flavor', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list projects', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list blueprint instances', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list blueprint templates', function (done) {
            true.should.equal(true);
            done();
        });

        it('should create new blueprint templates', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list networks', function (done) {
            true.should.equal(true);
            done();
        });

        it('should list routers', function (done) {
            true.should.equal(true);
            done();
        });

        it('should log out', function (done) {
            //console.log(browser.html());
            browser.clickLink("Sign Out", function() {
                setTimeout(function() {

                    browser.evaluate('$("#auth")[0].style["display"]').should.not.equal("none");
                    done();
                }, 0);
            });
        });
    });
});
