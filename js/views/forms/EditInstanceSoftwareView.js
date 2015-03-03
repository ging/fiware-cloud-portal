var EditInstanceSoftwareView = Backbone.View.extend({

    _template: _.itemplate($('#editInstanceSoftwareFormTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,

    dial: undefined,

    events: {
        'submit #form': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close',
        'click #cancel-attrs': 'cancelAttrs',
        'click #accept-attrs': 'acceptAttrs'
    },

    initialize: function() {
        this.options = this.options || {};

        var self = this;
        
        self.model.bind("change", self.render, self);

        this.editing = -1;

    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {  
        $('#edit_instance_software').remove();
        $('.modal-backdrop').remove();
        this.tableView.close();
        this.tableViewNew.close();
        this.unbind();
        this.undelegateEvents();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
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
            label: "Uninstall",
            action: "uninstall",
            activatePattern: groupSelected
        // }, {
        //     label: "Edit Attributes",
        //     action: "edit",
        //     activatePattern: oneSelected
        }];
    },

    getHeaders: function() {
        return [{
            name: "Name",
            tooltip: "Software name",
            size: "65%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Software name",
            size: "35%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];

        if (this.model.models.length === 0) {
            return entries;
        }

        var id = this.options.instanceModel.get("id");
        if (id) {

            var products= this.model.models;

            for (var product in products) {
                var stat = products[product].get('status');
                if (products[product].get('vm').fqn === id) {// && stat !== 'ERROR' && stat !== 'UNINSTALLED') {
                    var name = products[product].get('productRelease').product.name + ' ' + products[product].get('productRelease').version;
                    entries.push({id:products[product].get('name'), cells:[
                    {value: name,
                    tooltip: products[product].get('description')},
                    {value: products[product].get('status')}]});
                }
            }
        }

        return entries;
    },

    getMainButtonsNew: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
        // [{
        //     label: "Allocate IP to Project",
        //     action: "allocate"
        // }];
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
            label: "Install",
            action: "install",
            activatePattern: groupSelected
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

    getEntriesNew: function() {
        var entries = [];
        
        var products = this.options.sdcCatalog.models;

        if (products === undefined) {
            return 'loading';
        }

        for (var product in products) {
            var comp = true;

            if (products[product].get('metadatas').image) {
                comp = false;
                if (typeof(products[product].get('metadatas').image) === 'string') {
                    var compImages = products[product].get('metadatas').image.split(' ');
                    for (var im in compImages) {
                        if (compImages[im] === this.options.instanceModel.get('image').id) {
                            comp = true;
                        }
                    }
                }
            } 

            if (comp) {
                entries.push(
                    {id: product, cells:[
                    {value: products[product].get('name') + ' ' + products[product].get('version'),
                    tooltip: products[product].get('description')}]});
            }

        }
        return entries;

    },

    installSoftware: function(ids) {
        var product = new Software();
        var ip;
        var addrs = this.options.instanceModel.get("addresses");

        if (JSTACK.Keystone.getendpoint(UTILS.Auth.getCurrentRegion(), "network") !== undefined) {
            ip = addrs[Object.keys(addrs)[0]][0].addr;
        } else {
            ip = addrs["private"][0].addr; 
        }
        var fqn = this.options.instanceModel.get("id");
        var name = this.options.sdcCatalog.models[ids[0]].get('name');
        var version = this.options.sdcCatalog.models[ids[0]].get('version');

        product.set({"name": fqn + '_' + name + '_' + version});
        product.set({"ip": ip});
        product.set({"product": {name: name, version: version}});
        product.set({"fqn": fqn});

        product.save(undefined, UTILS.Messages.getCallbacks('Product "' + this.options.sdcCatalog.models[ids[0]].get('name') + '" installing...', 'Error installing product "' + ids[0] + '"', {el: '#log-messages-software'}));
    },

    uninstallSoftware: function(ids) {
        var product = this.model.findWhere({name: ids[0]});
        var pname = product.get('productRelease').product.name;
        product.destroy(UTILS.Messages.getCallbacks('Product "' + pname + '" uninstalling...', 'Error uninstalling product "' + ids[0] + '"', {el: '#log-messages-software'}));
    },

    onAction: function(action, ids) {

        var self = this;

        switch (action) {
            case 'install':
                this.installSoftware(ids);
                break;

            case 'uninstall':
                this.uninstallSoftware(ids);
                break;

            case 'edit':
                var product = this.addedProducts[ids];
                this.edit = ids;
                console.log(product);
                var productAttributes = product.attributes_asArray;
                var str='';
                for (var i in productAttributes) {
                    attr = productAttributes[i];
                    str += '<tr id="sec_groups__row__" class="ajax-update status_down"><td>'+attr.key+'</td><td><input type="text" name="attr_'+i+'" value="'+attr.value+'""></td><td>'+attr.description+'</td></tr>';
                }
                if (str === '') {
                    str = '<tr id="sec_groups__row__" class="ajax-update status_down"><td></td><td style="text-align: center;">No items to display</td><td></td></tr>';

                }
                $('#software-attrs-table').html(str);
                $('#software_edit').animate({
                    marginTop: '+=220px'
                }, 300, function() {
                    // Animation complete.
                });
                var effects = {};
                effects["-webkit-filter"] = "blur(1px)";
                effects.opacity = "0.3";
                $('.blurable').animate(effects, 200, function() {
                    $('.blurable').addClass("blur");
                    $('.blurable').bind("click", false);
                });
                $('#attributes_edit').css('display', 'block');
            break;
        }
        return false;
    },

    attrsDone: function() {
        $('#software_edit').animate({
            marginTop: '-=220px'
        }, 300, function() {
            // Animation complete.
        });
        $('#attributes_edit').css('display', 'none');
        var effects = {};
        effects["-webkit-filter"] = "blur(0px)";
        effects.opacity = "1";
        $('.blurable').animate(effects, 100, function() {
            $('.blurable').removeClass("blur");
            $('.blurable').unbind("click", false);
        });

        if (this.addedProducts[this.edit].attributes_asArray) {

            for (var at in this.addedProducts[this.edit].attributes_asArray) {
                var inp = 'input[name=attr_'+ at+']';
                this.addedProducts[this.edit].attributes_asArray[at].value = this.$(inp).val();
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
    },

    onCatalogDrag: function(entryId) {
        return entryId;
    },

    onCatalogDrop: function(targetId, entryId) {
        console.log("Uninstalled:", targetId, entryId);
        this.uninstallSoftware([entryId]);
    },

    onInstalledSoftwareDrop: function(targetId, entryId) {
        console.log("Installing:", targetId, entryId);
        this.installSoftware([entryId]);
    },

    onInstalledSoftwareDrag: function(entryId) {
        return entryId;
    },

    onInstalledSoftwareMove: function(targetId, entryId) {
        //this.movingSoftware(entryId, targetId);
    },

    render: function () {
        if ($('#edit_instance_software').html() !== null) {
            $('#edit_instance_software').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        this.tableView = new TableView({
            el: '#installedInstanceSoftware-table',
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
            dropable: true,
            draggable: true,
            onDrop: this.onInstalledSoftwareDrop,
            onDrag: this.onInstalledSoftwareDrag,
            context: this,
            order: false
        });

        this.tableViewNew = new TableView({
            el: '#newInstanceSoftware-table',
            actionsClass: "actionsSDCTier",
            headerClass: "headerSDCTier",
            bodyClass: "bodySDCTier",
            footerClass: "footerSDCTier",
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtonsNew,
            getMainButtons: this.getMainButtonsNew,
            getHeaders: this.getHeadersNew,
            getEntries: this.getEntriesNew,
            dropable: true,
            draggable: true,
            disableActionButton: true,
            onDrag: this.onCatalogDrag,
            onDrop: this.onCatalogDrop,
            context: this
        });
        this.tableView.render();
        this.tableViewNew.render();
        $('.modal:last').modal();
        this.dial = $(".dial-form").knob();
        return this;
    }
});
