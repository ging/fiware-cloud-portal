var EditTierView = Backbone.View.extend({

    _template: _.itemplate($('#editTierFormTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,
    netTableView: undefined,
    netTableViewNew: undefined,

    dial: undefined,

    currentStep: 0,

    events: {
        'click #close-image': 'close',
        'click .modal-backdrop': 'close',
        'keyup .tier-values': 'onInput',
        'click #cancel-attrs': 'cancelAttrs',
        'click #accept-attrs': 'acceptAttrs',
        'click #btn-apply-icon': 'applyIcon',
        'click #btn-show-networks': 'showNetworks',
        'click #btn-hide-networks': 'hideNetworks',
        'click #addNewAlias': 'addNewAlias',
        'change #id_region': 'onRegionChange',
        'change #id_image': 'onImageChange',
        'click #cancelBtn-image': 'goPrev',
        'submit #form': 'goNext'
    },

    initialize: function() {
        this.options = this.options || {};
        
        this.editing = -1;

        this.addedProducts = [];
        this.addedNetworks = [];

        // Here we detect if we want to create a Tier
        this.options.tier = this.options.tier || {};

        var self = this;
        if (this.options.tier.icono === undefined || this.options.tier.icono.toString() === "[object Object]") {
            this.options.tier.icono = "";
        }
        if (this.options.tier.productReleaseDtos_asArray) {
            this.options.tier.productReleaseDtos_asArray.forEach(function(product) {
                product.name = product.productName;
                product.description = product.productDescription;
                var prod = new Software(product);
                self.addedProducts.push(prod);
            });
        }

        this.tmpModels = {
            images: new Images(),
            flavors: new Flavors(),
            keypairs: new Keypairs(),
            sdcs: new Softwares(),
            sdcCatalog: new SoftwareCatalogs(),
            networks: new Networks(),
            subnets: new Subnets()
        };

        this.current_region = UTILS.Auth.getCurrentRegion();
    },

    updateTmpModels: function(region) {

        var self = this;

        var image_selector = $("#id_image");
        var flavor_selector = $("#id_flavor");
        var keypair_selector = $("#id_keypair");

        image_selector.empty();
        flavor_selector.empty();
        keypair_selector.empty();

        image_selector.append(new Option('Loading ...', ''));
        flavor_selector.append(new Option('Loading ...', ''));
        keypair_selector.append(new Option('Loading ...', ''));

        // Update images, flavors and keypairs tmp models

        this.tmpModels.images.region = region;
        this.tmpModels.flavors.region = region;
        this.tmpModels.keypairs.region = region;

        this.tmpModels.images.fetch({success: function(collection) {

            var images = collection.models;

            image_selector.empty();

            var sdcImages = 0;
            for (var i in images) {
                if ((images[i].get("properties") !== undefined && images[i].get("properties").sdc_aware) || images[i].get("sdc_aware")) {
                    sdcImages++;
                    if (images[i].get('id') === self.options.tier.image) {
                         image_selector.append(new Option(images[i].get("name"), images[i].get('id'), true, true));
                    } else {
                         image_selector.append(new Option(images[i].get("name"), images[i].get('id')));
                    }
                }
            }

            if (images.length === 0 || sdcImages === 0) {
                image_selector.append(new Option('No images available', ''));
            }
            self.tableViewNew.render();
        }});

        this.tmpModels.flavors.fetch({success: function(collection) {

            var flavors = collection.models;

            flavor_selector.empty();

            for (var f in flavors) {
                if (flavors[f].get('disk') !== 0) {
                    var text = flavors[f].get("name") + " (" + flavors[f].get("vcpus") + "VCPU / " + flavors[f].get("disk") + "GB Disk / " + flavors[f].get("ram") + "MB Ram )";
                    if (flavors[f].id === self.options.tier.flavour) {
                        flavor_selector.append(new Option(text, flavors[f].id, true, true));
                    } else {
                        flavor_selector.append(new Option(text, flavors[f].id));
                    }
                }
            }
        }});

        this.tmpModels.keypairs.fetch({success: function(collection) {

            var keypairs = collection.models;

            keypair_selector.empty();

            if (keypairs.length === 0) {
                keypair_selector.append(new Option('No keypairs available', ''));
            } else {
                for (var k in keypairs) {
                    keypair_selector.append(new Option(keypairs[k].get('name'), keypairs[k].get('name')));
                }
            }
        }});

        // Update networks and subnets tmp model

        this.tmpModels.networks.region = region;
        this.tmpModels.subnets.region = region;

        this.networkList = [];
        var current_tenant_id = JSTACK.Keystone.params.access.token.tenant.id;

        this.tmpModels.subnets.fetch({success: function(subnets_collection) {
            self.tmpModels.networks.fetch({success: function(net_collection) {
                var added = {};

                var all_subnets = subnets_collection.models;
                for (var index in net_collection.models) {
                    var network = net_collection.models[index];
                    var tenant_id = network.get("tenant_id");
                    var subnets = [];
                    var subnet_ids = network.get("subnets");
                    if ((current_tenant_id == tenant_id && network.get("router:external") !== true) || network.get('shared') === true) {
                        for (var i in subnet_ids) {
                            sub_id = subnet_ids[i];
                            for (var j in all_subnets) {
                                if (sub_id == all_subnets[j].id) {
                                    var sub_cidr = all_subnets[j].attributes.name+" "+all_subnets[j].attributes.cidr;
                                    subnets.push(sub_cidr);
                                }
                            }
                        }
                        if (subnets.length > 0) {
                            var temp = network.attributes.name === "" ? "("+network.get("id").slice(0,8)+")" : network.attributes.name;
                            var name = temp + " (" + subnets + ")";
                            added[temp] = {displayName: name, name: network.attributes.name, net_id: network.id};
                            self.networkList.push(added[temp]);
                        }
                    }
                }

                self.addedNetworks = [];
                var myTier = self.options.tier;
                if (myTier.hasOwnProperty("networkDto_asArray")) {
                    var myNets = myTier.networkDto_asArray;
                    for (var myNetIdx in myNets) {
                        var myNet = myNets[myNetIdx];
                        var displayName = myNet.networkName;
                        if (added[myNet.networkName] !== undefined) {
                            displayName = added[myNet.networkName].displayName;
                        }
                        self.addedNetworks.push({displayName: displayName, name: myNet.networkName, alias: true /* TODO Check if it is not an alias*/});
                    }
                }

                var tiers = self.model.get("tierDtos_asArray");

                for (var tierIdx in tiers) {
                    var tier = tiers[tierIdx];
                    if (tier.hasOwnProperty("networkDto_asArray")) {
                        var nets = tier.networkDto_asArray;
                        for (var netIdx in nets) {
                            var net = nets[netIdx];
                            if (added[net.networkName] === undefined) {
                                self.networkList.push({displayName: net.networkName, name: net.networkName, alias: true /* TODO Check if it is not an alias*/});
                                added[net.networkName] = net;
                            }
                        }
                    }
                }

                if (added.Internet === undefined) {
                    self.networkList.push({displayName: "Internet", name: "Internet"});
                }

                self.netTableView.render();
                self.netTableViewNew.render();

            }});
        }});

        // Update SDC tmp model

        this.tmpModels.sdcCatalog.fetch({success: function () {

            self.tableViewNew.render();
            self.tableView.render();

        }, error: function (e) {
            self.tableViewNew.render();
            self.tableView.render();
            console.log(e);
        }});
    },

    onRegionChange: function(e) {
        this.current_region = e.currentTarget.value;
        this.render();
    },

    onImageChange: function(e) {
        this.tableViewNew.render();
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_tier').remove();
        $('.modal-backdrop').remove();
        this.tableView.close();
        this.tableViewNew.close();
        this.netTableView.close();
        this.netTableViewNew.close();
        this.unbind();
        this.undelegateEvents();
    },

    onInput: function() {
        var min = parseInt($('#tier-min-value').val(), 0);
        var max = parseInt($('#tier-max-value').val(), 0);
        var dial = this.dial[0];

        dial.o.min = min;
        dial.o.max = max;

        dial.cv = dial.o.min;

        if (dial.cv > dial.o.max) {
            dial.cv = dial.o.max;
        } else if (dial.cv < dial.o.min) {
            dial.cv = dial.o.min;
        }
        dial.v = dial.cv;

        if (min > max) {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("Max value should be greater than min value");
            dial.v = '-';
        } else {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("");
        }

        if (isNaN(min) || isNaN(max)) {
            dial.v = '-';
        }

        dial._draw();
    },

    getNetMainButtons: function() {
        return [];
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
    },

    getNetDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Remove",
            action: "uninstall",
            activatePattern: groupSelected
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Remove",
            action: "uninstall",
            activatePattern: groupSelected
        }, {
            label: "Edit Attributes",
            action: "edit",
            activatePattern: oneSelected
        }];
    },

    getNetHeaders: function() {
        return [{
            name: "Name",
            tooltip: "Network name",
            size: "55%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getHeaders: function() {
        return [{
            name: "Name",
            tooltip: "Software name",
            size: "55%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getNetEntries: function() {
        var entries = [];

        for (var network in this.addedNetworks) {
            var name = this.addedNetworks[network].displayName;

            entries.push(
                {id: network, cells:[
                    {value: name}
                    ]
                });

        }

        return entries;
    },

    getEntries: function() {
        var entries = [];

        for (var product in this.addedProducts) {
            if (this.addedProducts[product].get('name') === 'testingpuppet') {
                console.log(this.addedProducts[product]);
            }

            var version = this.addedProducts[product].get('version') || '';

            entries.push(
                {id: product, cells:[
                    {value: this.addedProducts[product].get('name') + ' ' + version,
                    tooltip: this.addedProducts[product].get('description')}
                    ]
                });

        }

        return entries;
    },

    getNetMainButtonsNew: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
    },

    getMainButtonsNew: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
    },

    getNetDropdownButtonsNew: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Add",
            action: "install",
            activatePattern: groupSelected
        }];
    },

    getDropdownButtonsNew: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Add",
            action: "install",
            activatePattern: groupSelected
        }];
    },

    getNetHeadersNew: function() {
        return [{
            name: "Name",
            tooltip: "Network name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getHeadersNew: function() {
        return [{
            name: "Name",
            tooltip: "Software name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getNetEntriesNew: function() {
        var entries = [];

        var networks = this.networkList;

        if (networks === undefined) {
            return 'loading';
        }

        for (var network in networks) {
            var name = networks[network].displayName;
            entries.push(
                {id: network, cells:[
                {value: name}]});

        }

        entries = [{id: networks.length, isDraggable: false, cells:[
                {value: '<input type="text" id="aliasName" placeholder="Enter the alias of a new network..."><button id="addNewAlias">+</button>'}]}].concat(entries);
        return entries;

    },

    getEntriesNew: function() {
        var entries = [];

        var products = this.tmpModels.sdcCatalog.models;

        if (products.length === 0) {
            return 'loading';
        }

        var imageId = $("#id_image option:selected")[0].value;

        for (var product in products) {
            var comp = true;

            if (products[product].get('metadatas') && typeof products[product].get('metadatas').image === 'string') {
                comp = false;
                var compImages = products[product].get('metadatas').image.split(' ');
                for (var im in compImages) {
                    if (compImages[im] === imageId) {
                        comp = true;
                    }
                }
            } 

            var version = products[product].get('version') || '';

            if (comp) {
                entries.push(
                    {id: product, cells:[
                    {value: products[product].get('name') + ' ' + version,
                    tooltip: products[product].get('description')}]});
            }

        }

        return entries;

    },

    addNewAlias: function() {
        var name = $("#aliasName").val();
        var exists = false;
        for (var id in this.networkList) {
            var net = this.networkList[id];
            if (net.name === name) {
                exists = true;
                continue;
            }
        }
        if (!exists) {
            for (var a in this.addedNetworks) {
                if (this.addedNetworks[a].name === name) {
                    exists = true;
                    continue;
                }
            }
        }
        if (!exists) {
            this.networkList = [{name: name, displayName: name}].concat(this.networkList);
        }
        this.netTableViewNew.render();
    },

    installSoftware: function(id, targetId) {
        product = this.tmpModels.sdcCatalog.models[id];
        var self = this;

        var exists = false;
        for (var a in self.addedProducts) {
            if (self.addedProducts[a].get('name') === product.get('name')) {
                exists = true;
                continue;
            }
        }
        if (!exists) {
            //self.addedProducts.push(product);
            product.fetch({success: function (resp) {
                targetId = targetId || self.addedProducts.length;
                console.log("Installing on: ", targetId);
                self.addedProducts.splice(targetId, 0, product);
                self.tableView.render();

            }, error: function (e) {

            }});
        }
    },

    installNetwork: function(id, targetId) {
        network = this.networkList[id];
        var exists = false;
        for (var a in this.addedNetworks) {
            if (this.addedNetworks[a].name === network.name) {
                exists = true;
                continue;
            }
        }
        if (!exists) {
            targetId = targetId || this.addedNetworks.length;
            this.addedNetworks.splice(targetId, 0, network);
            this.netTableView.render();
        }
    },

    movingSoftware: function(id, targetId) {
        var product = this.addedProducts[id];
        this.addedProducts.splice(id, 1);
        var offset = 0;
        if (id < targetId) {
            offset = 1;
        }
        targetId = targetId || this.addedProducts.length - offset;
        console.log("Moving to: ", targetId);
        this.addedProducts.splice(targetId, 0, product);
        this.tableView.render();
    },

    movingNetwork: function(id, targetId) {
        var network = this.addedNetworks[id];
        this.addedNetworks.splice(id, 1);
        var offset = 0;
        if (id < targetId) {
            offset = 1;
        }
        targetId = targetId || this.addedNetworks.length - offset;
        this.addedNetworks.splice(targetId, 0, network);
        this.netTableView.render();
    },

    uninstallSoftware: function(id) {
        this.addedProducts.splice(id, 1);
        this.tableView.render();
    },

    uninstallNetwork: function(id) {
        this.addedNetworks.splice(id, 1);
        this.netTableView.render();
    },

    showNetworks: function() {
        $('#scroll-based-layer-networks').animate({
            scrollLeft: $('#scroll-based-layer-networks').width()+1
        }, 500, function() {
            // Animation complete.
        });
        $('#btn-show-networks').animate({
            opacity: 0
        }, 500, function() {
            // Animation complete.
            $('#btn-show-networks').hide();
        });
        $('#btn-hide-networks').animate({
            opacity: 1
        }, 500, function() {
            // Animation complete.
            $('#btn-hide-networks').show();
        });
    },

    hideNetworks: function() {
        $('#scroll-based-layer-networks').animate({
            scrollLeft: 0
        }, 500, function() {
            // Animation complete.
        });
        $('#btn-show-networks').animate({
            opacity: 1
        }, 500, function() {
            // Animation complete.
            $('#btn-show-networks').show();
        });
        $('#btn-hide-networks').animate({
            opacity: 0
        }, 500, function() {
            // Animation complete.
            $('#btn-hide-networks').hide();
        });
    },

    onNetAction: function(action, ids) {

        var self = this;

        var product;

        switch (action) {
            case 'install':
                this.installNetwork(ids);
            break;
            case 'uninstall':
                this.uninstallNetwork(ids);
            break;
        }
        return false;
    },

    onAction: function(action, ids) {

            var self = this;

            var product;

            switch (action) {
                case 'install':
                    self.installSoftware(ids);

                break;
                case 'uninstall':
                    self.uninstallSoftware(ids);
                break;
                case 'edit':
                    product = this.addedProducts[ids];
                    this.edit = ids;
                    var productAttributes = product.get('attributes_asArray');
                    var str='';
                    for (var i in productAttributes) {
                        attr = productAttributes[i];
                        if (attr.description === undefined) attr.description = '-';
                        if (attr.type === 'IP' || attr.type === 'IPALL') {

                            str += 
                            '<tr id="sec_groups__row__" class="ajax-update status_down">' +
                                '<td>' + attr.key + '</td>' +
                                '<td>' +
                                    '<select name="attr_' + i + '">';

                                    var my_name = this.$('input[name=name]').val();
                                    var im_new = true;

                                    for (var t in this.model.get('tierDtos_asArray')) {
                                        var ti = this.model.get('tierDtos_asArray')[t];
                                        if (attr.value === ti.name) {
                                            str += '<option selected value="' + ti.name + '">Tier ' + ti.name + ' IP address</option>';
                                        } else {
                                            str += '<option value="' + ti.name + '">Tier ' + ti.name + ' IP address</option>';
                                        }
                                        if (ti.name === my_name) {
                                            im_new = false;
                                        }
                                    }

                                    if (im_new) {
                                        str += '<option value="' + my_name + '">Tier ' + my_name + ' IP address</option>';
                                    }
                                        
                            str +=                                   
                                    '</select>' +
                                '</td>' +
                                '<td>' + attr.description + '</td>' +
                            '</tr>';

                        } else {
                            str += 
                            "<tr id='sec_groups__row__' class='ajax-update status_down'>" +
                                "<td>" + attr.key + "</td>" +
                                "<td>" +
                                    "<input type='text' name='attr_" + i + "' value='" + attr.value + "'>" +
                                "</td>" +
                                "<td>" + attr.description + "</td>" +
                            "</tr>";
                        }
                    }
                    if (str === '') {
                        str = 
                        '<tr id="sec_groups__row__" class="ajax-update status_down">' +
                            '<td></td>' +
                            '<td style="text-align: center;">No items to display</td>' +
                            '<td></td>' +
                        '</tr>';

                    }
                    $('#software-attrs-table').html(str);
                    $('#scroll-based-layer').animate({
                        scrollLeft: $('#scroll-based-layer').width()
                    }, 500, function() {
                        // Animation complete.
                    });
                    var effects = {};
                    effects["-webkit-filter"] = "blur(1px)";
                    effects.opacity = "0.3";
                    $('.blurable').animate(effects, 500, function() {
                        $('.blurable').addClass("blur");
                        $('.blurable').bind("click", false);
                    });
                break;
            }
            return false;
        },

    attrsDone: function() {
        $('#scroll-based-layer').animate({
            scrollLeft: 0
        }, 500, function() {
            // Animation complete.
        });
        var effects = {};
        effects["-webkit-filter"] = "blur(0px)";
        effects.opacity = "1";
        $('.blurable').animate(effects, 500, function() {
            $('.blurable').removeClass("blur");
            $('.blurable').unbind("click", false);
        });

        var atts = this.addedProducts[this.edit].get('attributes_asArray');

        if (atts) {
            for (var at in atts) {
                var val;
                if (atts[at].type === 'IP' || atts[at].type === 'IPALL') {
                    val = atts[at].type + '(' + this.$('select[name=attr_'+ at+']').val() + ')';
                } else {
                    val = this.$('input[name=attr_'+ at+']').val();
                }
                atts[at].value = val;
            }
        }
    },

    cancelAttrs: function(evt) {
        evt.preventDefault();
        this.attrsDone();
    },

    acceptAttrs: function(evt) {
        evt.preventDefault();
        this.attrsDone();
        // TODO Update attributes in JSON
    },

    onUpdate: function(e){
        var self = this;
        var name, flavorReg, key_name, image, public_ip, min, max, initial, region;

        name = this.$('input[name=name]').val();

        flavorReg = $("#id_flavor option:selected")[0].value;

        image = $("#id_image option:selected")[0].value;

        image = $("#id_image option:selected")[0].value;

        icon = this.$('input[name=icon]').val();

        if ($("#id_keypair option:selected")[0].value !== '') {
            key_name = $("#id_keypair option:selected")[0].value;
        }

        region = $("#id_region option:selected")[0].value;

        public_ip = ($('input[name=public_ip]:checked').length > 0);

        min = this.$('input[name=tier-min-value]').val();

        max = this.$('input[name=tier-max-value]').val();

        initial = this.dial[0].v;

        var tier = {
            name: name,
            flavour: flavorReg,
            floatingip: public_ip,
            image: image,
            icono: icon,
            keypair: key_name,
            region: region,
            minimumNumberInstances: min,
            maximumNumberInstances: max,
            initialNumberInstances: initial
        };

        if (this.addedProducts.length !== 0) {

            tier.productReleaseDtos = [];
            for (var p in this.addedProducts) {
                var nP = {productName: this.addedProducts[p].get('name'), version: this.addedProducts[p].get('version'), info: this.addedProducts[p].attributes};

                var attrs = this.addedProducts[p].get('attributes_asArray');
                if (attrs) {
                    nP.attributes = [];
                    for (var at in attrs) {
                        var inp = 'input[name=attr_'+ this.addedProducts[p].get('name')+'_'+ at+']';
                        var attrib = {key: attrs[at].key, value: attrs[at].value, type: attrs[at].type};
                        nP.attributes.push(attrib);
                    }
                }
                tier.productReleaseDtos.push(nP);
            }
        }

        if (this.addedNetworks.length !== 0) {

            tier.networkDto = [];
            for (var n in this.addedNetworks) {
                var nN = {networkName: this.addedNetworks[n].name};
                if (this.addedNetworks[n].net_id !== undefined) {
                    nN.networkId = this.addedNetworks[n].net_id;
                }
                tier.networkDto.push(nN);
            }
        }

        var success_mg = "Tier "+name + " created.";
        var error_msg = "Error creating tier "+name;
        if (this.options.tier.flavour !== undefined) {
            success_mg = "Tier "+name + " updated.";
            error_msg = "Error updating tier "+name;
        }

        var options = UTILS.Messages.getCallbacks(success_mg, error_msg, {context: self});

        options.tier = tier;

        var cb2 = options.callback;

        options.callback = function () {
            cb2();
            self.options.callback();
        };
        if (this.options.tier.flavour !== undefined) {
            self.model.updateTier(options);
        } else {
            self.model.addTier(options);
        }
        
    },

    applyIcon: function() {
        var icon = this.$('input[name=icon]').val();
        if (icon !== "") {
            this.$('#edit-tier-image').attr("src", icon);
            this.$('#edit-tier-image').show();
            this.$('.tier-image-back').hide();
        } else {
            this.$('#edit-tier-image').attr("src", "");
            this.$('#edit-tier-image').hide();
            this.$('.tier-image-back').show();
        }
    },

    onCatalogDrag: function(entryId) {
        console.log("Obtained:", entryId);
        return entryId;
    },

    onCatalogDrop: function(targetId, entryId) {
        console.log("Uninstalled:", targetId, entryId);
        this.uninstallSoftware(entryId);
    },

    onInstalledSoftwareDrop: function(targetId, entryId) {
        console.log("Installing:", targetId, entryId);
        this.installSoftware(entryId, targetId);
    },

    onInstalledSoftwareDrag: function(entryId) {
        return entryId;
    },

    onInstalledSoftwareMove: function(targetId, entryId) {
        console.log("Moving:", targetId, entryId);
        this.movingSoftware(entryId, targetId);
    },

    onNewNetworkDrag: function(entryId) {
        console.log("Obtained:", entryId);
        return entryId;
    },

    onNewNetworkDrop: function(targetId, entryId) {
        console.log("Uninstalled:", targetId, entryId);
        this.uninstallNetwork(entryId);
    },

    onInstalledNetworkDrop: function(targetId, entryId) {
        console.log("Installing:", targetId, entryId);
        this.installNetwork(entryId, targetId);
    },

    onInstalledNetworkDrag: function(entryId) {
        return entryId;
    },

    onInstalledNetworkMove: function(targetId, entryId) {
        console.log("Moving:", targetId, entryId);
        this.movingNetwork(entryId, targetId);
    },

    goNext: function() {

        if (this.currentStep === this.steps.length - 1) {
            this.onUpdate();
        } else {
            if (this.currentStep === 0) {
                $('#cancelBtn-image').html('Back');
            }
            if (this.currentStep === this.steps.length - 2) {
                if (this.options.tier.flavour !== undefined) {
                    $('#nextBtn-image').val('Edit tier');
                } else {
                    $('#nextBtn-image').val('Create tier');
                }
            }

            var curr_id = '#' + this.steps[this.currentStep].id;
            var next_id = '#' + this.steps[this.currentStep + 1].id;
            var next_tab = next_id + '_tab';
            var next_line = next_id + '_line';
            
            $(curr_id).hide();
            $(next_id).show();
            $(next_tab).addClass('active');
            $(next_line).addClass('active');

            this.currentStep = this.currentStep + 1;
        }
    }, 

    goPrev: function() {

        if (this.currentStep === 0) {
            this.close();
        } else {
            if (this.currentStep === 1) {
                $('#cancelBtn-image').html('Cancel');
            }
            if (this.currentStep === this.steps.length - 1) {
                $('#nextBtn-image').val('Next');
                $('#nextBtn-image').attr("disabled", null);
            }

            var curr_id = '#' + this.steps[this.currentStep].id;
            var curr_tab = curr_id + '_tab';
            var curr_line = curr_id + '_line';
            var prev_id = '#' + this.steps[this.currentStep - 1].id;
            
            $(curr_id).hide();
            $(prev_id).show();
            $(curr_tab).removeClass('active');
            $(curr_line).removeClass('active');

            this.currentStep = this.currentStep - 1;
        }
    },

    render: function () {
        if ($('#edit_tier').html() !== null) {
            $('#edit_tier').remove();
            $('.modal-backdrop').remove();
        }


        if (JSTACK.Keystone.getendpoint(this.current_region, "network") !== undefined) {
            this.networks = undefined;
            this.steps = [
            {id: 'input_details', name: 'Details'}, 
            {id: 'software_tab', name: 'Install Software'},
            {id: 'network_tab', name: 'Connect Network'}
            ];
        
        } else {
            this.networks = [];
            this.steps = [
                {id: 'input_details', name: 'Details'}, 
                {id: 'software_tab', name: 'Install Software'}                ];
        }


        $(this.el).append(this._template({model:this.model, tier: this.options.tier, regions: this.options.regions, steps: this.steps, current_region: this.current_region}));
        this.tableView = new TableView({
            el: '#installedSoftware-table',
            actionsClass: "actionsSDCTier",
            headerClass: "headerSDCTier",
            bodyClass: "bodySDCTier",
            footerClass: "footerSDCTier",
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            disableActionButton: true,
            context: this,
            order: false,
            draggable: true,
            dropable: true,
            sortable: true,
            onDrop: this.onInstalledSoftwareDrop,
            onDrag: this.onInstalledSoftwareDrag,
            onMove: this.onInstalledSoftwareMove
        });

        this.tableViewNew = new TableView({
            el: '#newSoftware-table',
            actionsClass: "actionsSDCTier",
            headerClass: "headerSDCTier",
            bodyClass: "bodySDCTier",
            footerClass: "footerSDCTier",
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtonsNew,
            getMainButtons: this.getMainButtonsNew,
            getHeaders: this.getHeadersNew,
            getEntries: this.getEntriesNew,
            disableActionButton: true,
            dropable: true,
            draggable: true,
            context: this,
            onDrag: this.onCatalogDrag,
            onDrop: this.onCatalogDrop
        });
        this.tableView.render();
        this.tableViewNew.render();

        this.netTableView = new TableView({
            el: '#installedNetwork-table',
            actionsClass: "actionsNetTier",
            headerClass: "headerNetTier",
            bodyClass: "bodyNetTier",
            footerClass: "footerNetTier",
            onAction: this.onNetAction,
            getDropdownButtons: this.getNetDropdownButtons,
            getMainButtons: this.getNetMainButtons,
            getHeaders: this.getNetHeaders,
            getEntries: this.getNetEntries,
            disableActionButton: true,
            context: this,
            order: false,
            draggable: true,
            dropable: true,
            sortable: true,
            onDrop: this.onInstalledNetworkDrop,
            onDrag: this.onInstalledNetworkDrag,
            onMove: this.onInstalledNetworkMove
        });

        this.netTableViewNew = new TableView({
            el: '#newNetwork-table',
            actionsClass: "actionsNetTier",
            headerClass: "headerNetTier",
            bodyClass: "bodyNetTier",
            footerClass: "footerNetTier",
            onAction: this.onNetAction,
            getDropdownButtons: this.getNetDropdownButtonsNew,
            getMainButtons: this.getNetMainButtonsNew,
            getHeaders: this.getNetHeadersNew,
            getEntries: this.getNetEntriesNew,
            disableActionButton: true,
            context: this,
            dropable: true,
            draggable: true,
            order: false,
            sortable: false,
            onDrag: this.onNewNetworkDrag,
            onDrop: this.onNewNetworkDrop
        });

        this.netTableView.render();
        this.netTableViewNew.render();

        $('.modal:last').modal();
        this.dial = $(".dial-form").knob();
        this.applyIcon();

        this.updateTmpModels(this.current_region);

        return this;
    }

});
