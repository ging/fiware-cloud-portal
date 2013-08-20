var config = {};

config.development = {};
config.production = {};
config.oauth = {};

config.oauth = {
    client_id: '15',
    client_secret: '7f1d015eec9e0820c9bf08855375fac5f081d21914147c04de4947a1b76218d4a1ee33fae0c9a97a4558f05b71cddc5f08fdaffdc37e77438d32a55548ad6431',
    callbackURL: 'http://localhost/login'
};

config.development.keystone = {
	host: '130.206.80.62',
	port: 4730,
	admin_host: '130.206.80.62',
	admin_port: 4731
};

config.production.keystone = {
	host: '130.206.80.100',
	port: 5000,
	admin_host: '130.206.80.100',
	admin_port: 35357
};

config.development.nova = {
	host: '130.206.80.62',
};

config.production.nova = {
	host: '130.206.80.11',
};

config.development.glance = {
	host: '130.206.80.62',
};

config.production.glance = {
	host: '130.206.80.11',
};

config.development.sm = {
	host: '130.206.80.62',
};

config.production.sm = {
	host: '130.206.80.91',
};

config.development.sdc = {
	host: '130.206.80.119',
	port: 8081,
	path: true
};

config.production.sdc = {
	host: '130.206.82.161',
	port: 8080,
	path: false
};

config.development.paas = {
	host: '130.206.80.112',
};

config.production.paas = {
	host: '130.206.82.160',
};

module.exports = config;