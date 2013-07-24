var config = {};

config.development = {};
config.production = {};

config.development.keystone = {
	host: '130.206.80.63',
	port: 5000,
	admin_host: '130.206.80.63',
	admin_port: 35357
};

config.production.keystone = {
	host: '130.206.80.100',
	port: 5000,
	admin_host: '130.206.80.100',
	admin_port: 35357
};

config.development.nova = {
	host: '130.206.80.63',
};

config.production.nova = {
	host: '130.206.80.11',
};

config.development.glance = {
	host: '130.206.80.63',
};

config.production.glance = {
	host: '130.206.80.11',
};

config.development.sm = {
	host: '130.206.80.63',
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