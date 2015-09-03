FROM ubuntu:14.04

MAINTAINER FIWARE Cloud Portal Team. DIT-UPM

WORKDIR /opt

# Install Ubuntu dependencies
RUN sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git ruby1.9.1 -y && \
	sudo gem install sass -v 3.2.12 -y

# Download latest version of the code and install npm dependencies
RUN git clone https://github.com/ging/fi-ware-cloud-portal.git && \
	cd fi-ware-cloud-portal && \
	npm install && \
	./node_modules/grunt-cli/bin/grunt

# Run Cloud Portal
WORKDIR /opt/fi-ware-cloud-portal
CMD ["sudo", "node", "server.js"]