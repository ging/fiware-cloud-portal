#!/bin/bash

# Install Ubuntu dependencies
sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git ruby1.9.1 -y && \
	sudo gem install sass -v 3.2.12 -y && \

# Download Release 4.4 of the code and install npm dependencies
git clone --branch 4.4.1 https://github.com/ging/fiware-cloud-portal.git && \
	cd fiware-cloud-portal && \
	npm install && \
	./node_modules/grunt-cli/bin/grunt

# config.js should be configured when the instance is up and running
cp config.js.template config.js

# create upstart task
sudo cp extras/scripts/cloud-portal.conf /etc/init/cloud-portal.conf