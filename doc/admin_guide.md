# Installation and Administration Guide

- [Introduction](#introduction)
    - [Requirements](#requirements)
- [System Installation](#system-installation)
- [System Administration](#system-administration)
- [Sanity Check Procedures](#sanity-check-procedures)
    - [End to End testing](#end-to-end-testing)
    - [List of Running Processes](#list-of-running-processes)
    - [Network interfaces Up & Open](#network-interfaces-up--open)
    - [Databases](#databases)
- [Diagnosis Procedures](#diagnosis-procedures)
    - [Resource availability](#resource-availability)
    - [Remote Service Access](#remote-service-access)
    - [Resource consumption](#resource-consumption)
    - [I/O flows](#io-flows)

## Introduction

Welcome to the Installation and Administration Guide for the Self Service Interfaces Generic Enabler. This generic enabler is built on an Open Source project, and so where possible this guide points to the appropriate online content that has been created for this project. The online documents are being continuously updated and improved, and so will be the most appropriate place to get the most up to date information on installation and administration.

The required parts of this generic enabler are Object Storage GE, Service Manager GE, DCRM GE, OpenStack's Keystone, or Identity Manager GE. And it can also work with PaaS Manager GE.

### Requirements

In order to execute the Self Service Interfaces GE, it is needed to have previously installed the following software of framework:

- Administrative Scripting Toolkit 
    - Node.js Server v0.8.17 or greater. (http://nodejs.org/download/)
    - Node Packaged Modules. It is usually included within Node.js (https://npmjs.org/)

- User Cloud Portal
    - Node.js Server v0.8.17 or greater. (http://nodejs.org/download/)
    - Node Packaged Modules. It is usually included within Node.js (https://npmjs.org/)
    - Ruby is also used for generating CSS files during installation.

## System Installation

- **Prerequisites**

You should install Ruby, Ruby gem, Node and npm prior to run the Cloud portal.

This installation is divided into two parts:

- **Administrative Scripting Toolkit** 

It provides advanced cloud management, such as reboot, resize and change password of servers.

To use the scripting toolkit you first need to install the jstack component:

<pre>
 npm install jstack-client -g
</pre>

Once installed you can use the script, for instance, by running the next commands:

<pre>
 jstack-client -u username -p password -l http://130.206.80.100:5000/v2.0/ -t tenant_id server-list
</pre>

* **User Cloud Portal**

It supports daily user operations, such as start and stop instances, list images, create key-pairs, etc.

The following steps need to be performed to get the Cloud Portal up and running:

- Download the Cloud Portal, using [GitHub](http://github.com/ging/fiware-cloud-portal).

<pre>
 git clone https://github.com/ging/fiware-cloud-portal.git portal
</pre>

- Install all required libraries using NPM.

<pre>
 cd portal
 sudo gem install sass
 npm install
</pre>

- Configure installation

To configure Cloud portal you can copy the file named config.js.template to config.js and edit it with the corresponding info. Below you can see an example:

<pre>
 var config = {};
 
 config.useIDM = false;
 
 config.oauth = {
     account_server: '',
     client_id: '',
     client_secret: '',
     callbackURL: ''
 };
 
 config.keystone = {
     host: '130.206.80.123',
     port: 5000,
     admin_host: '130.206.80.123',
     admin_port: 35357, 
     username: 'administrator', 
     password: 'password',
     tenantId: '2131278931289371289euwe'
 };
 
 module.exports = config;
</pre>

- Compile the code by running:

<pre>
 npm install
</pre>

- Launch the executable by running the next command with administrative permissions as it is going to be run on TCP Port 80:

<pre>
 node server.js
</pre>

- You can also install forever.js to run it in a production environment:

<pre>
 sudo npm install forever -g
</pre>

- And then run the server using forever:

<pre>
 forever start server.js
</pre>

- To know the status of the process you can run the next command:

<pre>
 forever status
</pre>

## System Administration

Self-Service Interfaces GE do not need specific system administration since it is based on Web interfaces.

## Sanity Check Procedures

The Sanity Check Procedures are the steps that a System Administrator will take to verify that an installation is ready to be tested. This is therefore a preliminary set of tests to ensure that obvious or basic malfunctioning is fixed before proceeding to unit tests, integration tests and user validation.

### End to End testing

Please note that the following information is required before carrying out this procedure:

- the IP address of the Cloud Portal node (e.g. on the FIWARE Lab this is http://cloud.lab.fiware.org)
- the IP address of the Openstack Keystone node managing security for the Self-Service Interfaces GE Deployment.
- a valid username and password

1. Verify that http://cloud.lab.fiware.org can be reached. By default, web access will show a Login Page.
2. Acquire a valid username and password and access with those credentials. The resulting web page is the landing page of the Cloud Portal.
3. Verify that you can list instances and images of your project.

### List of Running Processes

In case you are using forever to run the Self-Service Interfaces the following command will allow the admin to see the process:

<pre>
 forever list
</pre>

### Network interfaces Up & Open

- TCP port 80 should be accessible to the web browsers in order to load the Portal.
- Cloud GEs should be accessible from the Cloud portal because it makes requests to them.

### Databases

Cloud Portal does not use traditional databases. It makes requests directly to other Generic Enablers.

## Diagnosis Procedures

The Diagnosis Procedures are the first steps that a System Administrator will take to locate the source of an error in a GE. Once the nature of the error is identified with these tests, the system admin will very often have to resort to more concrete and specific testing to pinpoint the exact point of error and a possible solution. Such specific testing is out of the scope of this section.

### Resource availability

- Verify that 2.5MB of disk space is left using the UNIX command 'df'

### Remote Service Access

Please make sure port 80 is accessible (port 443 in SSL mode).

### Resource consumption

Self-Service Interfaces GE has very minimal resource constraints on the server since it does not have any database or complex application logic.

Typical memory consumption is 100MB and it consumes almost the 1% of a CPU core of 2GHz, but it depends on user demand. It also consumes a great number of TCP sockets and it increases depending again on the demand.

### I/O flows

Clients access the Self Service Interface through the client's Web Browser. This is simple HTTP traffic. It makes requests periodically to the different Cloud GEs (SM GE, DCRM GE, Object Storage GE, Keystone, etc.) throught the Cloud portal.
