#
# Cookbook Name:: cloud_portal
# Recipe:: configure
#
# Copyright 2015, GING, ETSIT, UPM
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

INSTALL_DIR = node['cloud_portal'][:install_dir]

## Creating cloudportal config file
remote_file 'Copy config file' do
  path "#{INSTALL_DIR}/config.js"
  source "file://#{INSTALL_DIR}/config.js.template"
  owner 'root'
  group 'root'
  mode 0755
  not_if { ::File.exists?("#{INSTALL_DIR}/config.js") }
end

## Creating cloudportal service file
remote_file 'Copy service file' do
  path '/etc/init/cloud-portal.conf'
  source "file://#{INSTALL_DIR}/extras/scripts/cloud-portal.conf"
  owner 'root'
  group 'root'
  mode 0755
  not_if { ::File.exists?('/etc/init/cloud-portal.conf') }
end