bash :set_dependencies do
  code <<-EOH
    sudo add-apt-repository ppa:chris-lea/node.js -y && \
    sudo apt-get update && \
    sudo apt-get install make g++ software-properties-common python-software-properties nodejs git ruby1.9.1 -y && \
    sudo gem install sass -v 3.2.12 -y
  EOH
end

bash :get_system do
  code <<-EOH
    sudo cd /opt && \
    sudo git clone https://github.com/ging/fiware-cloud-portal.git && \
    sudo cd #{node['fiware-cloud-portal'][:app_dir]} && \
    sudo mkdir $HOME/.npm && \
    sudo chown -R $(whoami) "$HOME/.npm" && \
    sudo npm install && \
    sudo ./node_modules/grunt-cli/bin/grunt && \
    sudo cp config.js.template config.js
  EOH
end