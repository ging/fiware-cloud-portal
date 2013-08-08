var config = {};

config.development = {};
config.production = {};
config.oauth = {};

config.oauth = {
    client_id: '13',
    client_secret: '7469ce8db423f012b68aa28da79472b91de1a3272450b57e403492a563e8e3ea6341ab0e36d6ce985bfd78728a5aea60cf72c4e473ecc93d66ea1b4d7ef18456',
    callbackURL: 'http://rosendo.dit.upm.es/login'
};

config.development.keystone = {
	host: '130.206.80.68',
	port: 4730,
	admin_host: '130.206.80.68',
	admin_port: 4731
};

config.production.keystone = {
	host: '130.206.80.100',
	port: 5000,
	admin_host: '130.206.80.100',
	admin_port: 35357
};

config.development.nova = {
	host: '130.206.80.68',
};

config.production.nova = {
	host: '130.206.80.11',
};

config.development.glance = {
	host: '130.206.80.68',
};

config.production.glance = {
	host: '130.206.80.11',
};

config.development.sm = {
	host: '130.206.80.68',
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