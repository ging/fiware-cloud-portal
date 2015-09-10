# Self Services Interfaces Cloud Portal - Overview

## What you get

The Self Service Interfaces provide a support for the users of the cloud infrastructure and platform to manage their services and resources deployed in cloud. For the moment it consist of open source implementation of a User Portal and Scripts. The User Portal is implemented in a form of a Web GUI following the same functionality as the OpenStack Dashboard. All about the implementation and the functionality of the OpenStack Dashboard can be found under the Horizon project. The Scripts facilitate direct approach to the underlying cloud resources through a command line and is addressed for administrators. This user guide describes the User Portal part of the Self Service Interfaces.

The Self Services Interfaces is divided in two parts: User Portal and Toolkit.

- The User Portal is implemented in a form of a Web GUI following the example of the portals that today's common cloud infrastructure managers like Amazon EC2, Eucalyptus,Cloud Sigma, Rackspace, etc. have. In concrete it bases its design principles on the OpenStack Horizon Dashboard. The basic objective of the user portal is to facilitate the user of the cloud perform operations over the underlying infrastructure. This includes perform actions such as: create user, manage projects, lunch instances on a base of images, create images in the image repository, retrieve flavors from the resource, etc. Moreover the portal facilitates management of a Virtual Data centers (VDCs), Services and Service Data Centers (SDCs), PaaS management and will offer monitoring statistics of the physical and virtual machines.

- The Toolkit is aimed for administrators and experienced users and it consist of various scripts that permit to perform the same actions the user portal does and some more advanced options.

## Source code

You can find the source code of this project and the basic documentation in [GitHub](https://github.com/ging/fiware-cloud-portal)

## Documentation  

  - [User & Programmers Manual](user_guide.md)
  - [Installation & Administration Guide](admin_guide.md)
  - [How to run tests](admin_guide.md#end-to-end-testing)