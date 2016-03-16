# Self Services Interfaces - Cloud Portal

[![License badge](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Documentation badge](https://img.shields.io/badge/docs-stable-brightgreen.svg?style=flat)](http://fiware-cloud-portal.readthedocs.org/en/stable/)
[![Docker badge](https://img.shields.io/docker/pulls/fiware/cloud-portal.svg)](https://hub.docker.com/r/fiware/cloud-portal/)
[![Support badge]( https://img.shields.io/badge/support-sof-yellowgreen.svg)](http://stackoverflow.com/questions/tagged/fiware)

+ [Introduction](#def-introduction)
+ [How to Build & Install](#def-build)
    - [Docker](#def-docker)
+ [API Overview](#def-api)
+ [Advanced documentation](#def-advanced)
+ [License](#def-license)

---
<br>

<a name="def-introduction"></a>
## Introduction

This project is part of [FIWARE](http://fiware.org). You will find more information abour this FIWARE GE [here](http://catalogue.fiware.org/enablers/self-service-interfaces-cloud-portal).

- You will find the source code of this project in GitHub [here](https://github.com/ging/fiware-cloud-portal)
- You will find the documentation of this project in Read the Docs [here](http://fiware-cloud-portal.readthedocs.org/)

A JavaScript implementation of OpenStack Horizon component. This is a web portal developed using only in JavaScript, based on OpenStack Horizon.

<a name="def-build"></a>
## How to Build & Install

<ol>
	<li>Install necessary components:</li>
	<pre>
		sudo apt-get install make g++
		sudo apt-get install python-software-properties
		sudo add-apt-repository ppa:chris-lea/node.js
		sudo apt-get update
		sudo apt-get install nodejs npm git ruby1.9.3‏

		sudo gem install sass -v 3.2.12
	</pre>

	<li>Clone the repository to your workspace and change to the <code>fiware-cloud-portal</code> new directory</li>
	<pre>
		git clone git://github.com/ging/fiware-cloud-portal.git

		cd fiware-cloud-portal
	</pre>

	<li>Copy <code>config.js.template</code> to <code>config.js</code> in <code>fiware-cloud-portal</code> directory</li>
	<pre>
		cp config.js.template config.js
	</pre>

	<li>Log in Cloud Portal (https://account.lab.fiware.org/) and head to your account details </li>
	
	<p> </p>
	
	<li>Register a new application and bind it to your localhost</li>
	<img src= "https://github.com/ging/fiware-cloud-portal/blob/master/images/register_app.png"/>

	<li>Modify <code>config.js</code> file with the correct configuration and save changes</li>
	<pre>
	// Mandatory. TCP port to bind the server to
	config.http_port = 80;
	
	config.useIDM = false;

	// OAuth configuration. Only set this configuration if useIDM is true.
	config.oauth = {
		account_server: 'https://account.lab.fiware.org',
	    client_id: '',
	    client_secret: '',
	    callbackURL: ''
	};

	// Keystone configuration.
	config.keystone = {
		host: 'cloud.lab.fiware.org',
		port: 4730,
		admin_host: 'cloud.lab.fiware.org',
		admin_port: 4731, 
		username: '', 
		password: '',
		tenantId: ''
	};
	</pre>
	<blockquote>Note: You can set a different TCP port, but you will have to indicate that change in the application configuration and the <code>config.js</code> file.</blockquote> 

	<li>Install dependencies using npm and grunt and finally run the server</li>
	<pre>
		sudo npm install

		./node_modules/grunt-cli/bin/grunt debug

		sudo node server.js

	</pre>
	
</ol>

<a name="def-docker"></a>
### Docker

We also provide a Docker image to facilitate you the building of this GE.

- [Here](https://github.com/ging/fiware-cloud-portal/tree/master/extras/docker) you will find the Dockerfile and the documentation explaining how to use it.
- In [Docker Hub](https://hub.docker.com/r/fiware/cloud-portal/) you will find the public image.

<a name="def-api"></a>
## API Overview

Self Service Interfaces GE is a GUI to facilitate the access to Openstack services and other FIWARE GEs APIs. So it has not an API specification.

<a name="def-advanced"></a>
## Advanced Documentation

- [How to run tests](http://fiware-cloud-portal.readthedocs.org/en/latest/admin_guide#end-to-end-testing)
- [User & Programmers Manual](http://fiware-cloud-portal.readthedocs.org/en/latest/user_guide/)
- [Installation & Administration Guide](http://fiware-cloud-portal.readthedocs.org/en/latest/admin_guide/)

<a name="def-license"></a>
## License

The MIT License

Copyright (C) 2012 Universidad Politécnica de Madrid.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
