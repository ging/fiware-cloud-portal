var config = {};

config.development = {};
config.production = {};
config.oauth = {};

config.oauth = {
    client_id: '21',
    client_secret: 'e99ed4604b1d44af5a9c3027b490ffb1691484235bfa08e920a928210fd525b8bf07d1e2a9e345299406da2dbdbeedcf36080e644f227a6aa1a21e73e1fde703',
    callbackURL: 'http://cloud.lab.fi-ware.eu/login'
};

config.development.keystone = {
	host: 'cloud.lab.fi-ware.eu',
	port: 4730,
	admin_host: 'cloud.lab.fi-ware.eu',
	admin_port: 4731
};

config.production.keystone = {
	host: 'cloud.lab.fi-ware.eu',
	port: 4730,
	admin_host: 'cloud.lab.fi-ware.eu',
	admin_port: 4731
};

config.development.nova = {
	host: 'cloud.lab.fi-ware.eu',
};

config.production.nova = {
	host: 'cloud.lab.fi-ware.eu',
};

config.development.glance = {
	host: '172.30.1.204',
};

config.production.glance = {
	host: '172.30.1.204',
};

config.development.sm = {
	host: 'cloud.lab.fi-ware.eu',
};

config.production.sm = {
	host: 'cloud.lab.fi-ware.eu',
};

config.development.sdc = {
	host: 'saggita.lab.fi-ware.eu',
	port: 8080,
	path: false
};

config.production.sdc = {
	host: 'saggita.lab.fi-ware.eu',
	port: 8080,
	path: false
};

config.development.paas = {
	host: 'pegasus.lab.fi-ware.eu',
};

config.production.paas = {
	host: 'pegasus.lab.fi-ware.eu',
};

module.exports = config;
