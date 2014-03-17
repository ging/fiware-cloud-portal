var CreateSoftwareView = Backbone.View.extend({

    _template: _.itemplate($('#createSoftwareFormTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,

    events: {
      'click #cancelBtn-software': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'submit form': 'create',
      'click input[name=so]': 'switchSO'
    },

    initialize: function() {
        this.addedProducts = [];
        this.model.unbind("sync", this.renderTables, this);
        this.model.bind("sync", this.renderTables, this);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        $('#create_software').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Remove",
            action: "remove",
            activatePattern: groupSelected
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

    getEntries: function() {
        var entries = [];

        for (var product in this.addedProducts) {

            entries.push(
                {id: product, cells:[
                    {value: this.addedProducts[product].get('name') + ' ' + this.addedProducts[product].get('version'),
                    tooltip: this.addedProducts[product].get('description')}
                    ]
                });

        }

        return entries;
    },

    getDropdownButtonsNew: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        return [{
            label: "Add",
            action: "add",
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
        var products = this.model.models;

        if (products === undefined) {
            return 'loading';
        }

        for (var product in products) {
            entries.push(
                {id: product, cells:[
                {value: products[product].get('name') + ' ' + products[product].get('version'),
                tooltip: products[product].get('description')}]});
        }

        return entries;

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

    onAction: function(action, ids) {

        var self = this;

        var product;

        switch (action) {
            case 'add':
                this.installSoftware(ids);
            break;
            case 'remove':
                this.uninstallSoftware(ids);
            break;
        }
        return false;
    },

    installSoftware: function(id, targetId) {
        product = this.model.models[id];
        var exists = false;
        for (var a in this.addedProducts) {
            if (this.addedProducts[a].get('name') === product.get('name')) {
                exists = true;
                continue;
            }
        }
        if (!exists) {
            //this.addedProducts.push(product);
            targetId = targetId || this.addedProducts.length;
            console.log("Installing on: ", targetId);
            this.addedProducts.splice(targetId, 0, product);
            this.tableView.render();
        }
    },

    uninstallSoftware: function(id) {
        this.addedProducts.splice(id, 1);
        this.tableView.render();
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

    switchSO: function(e) {
        var length = $('input[name=so]:checked').length;
        var i;
    
        if (length !== 0) {
            for (i = 0; i < $('input[name=so]').length; i++) {
                $('input[name=so]')[i].setCustomValidity('');
            }
        } else {
            for (i = 0; i < $('input[name=so]').length; i++) {
                $('input[name=so]')[i].setCustomValidity('Select at least one operating system');
            }
        }
    },

    create: function(e) {

        console.log('CREATE');

        var self = this;

        var software = new SoftwareCatalog();

        var name = $('input[name=name]').val();
        var version = $('input[name=version]').val();
        var repo = $('select[name=repo]').val();
        var url = $('input[name=url]').val();
        var config_management = $('input[name=config_management]:checked').val();

        var sos = [];

        for (i = 0; i < $('input[name=so]:checked').length; i++) {
            sos.push($('input[name=so]:checked')[i].value);
        }
        
        var description = $('textarea[name=description]').val();
        var attributes = $('textarea[name=attributes]').val();
        var ports = $('input[name=ports]').val();

        software.set({'name': name});
        software.set({'version': version});
        software.set({'repo': repo});
        software.set({'url': url});
        software.set({'config_management': config_management});
        software.set({'operating_systems': sos});

        if (description !== "") software.set({'description': description});

        if (attributes !== "") {
            var at = [];
            var lines = attributes.split('\n');
            for (var l in lines) {
                var a = {attribute: lines[l].split(',')[0], value: lines[l].split(',')[1], description: lines[l].split(',')[2]};
                at.push(a);
            }
            software.set({'attributes': at});
        }

        if (ports !== "") {
            var port = ports.split(',');
            software.set({'ports': port});
        }
        
        if (this.addedProducts.length !== 0) {
            var prods = [];
            var prod; 
            for (var p in this.addedProducts) {
                prod = {name: this.addedProducts[p].get('name'), version: this.addedProducts[p].get('version')};
                prods.push(prod);
            }
            software.set({'dependencies': prods});
        }

        console.log('VA', software.attributes);
        software.save(undefined, UTILS.Messages.getCallbacks("Software " + name + " created.", "Error creating software " + name, {context: self}));          
    },

    renderTables: function () {
        this.tableView.render();
        this.tableViewNew.render();
    },

    render: function () {
        if ($('#create_software').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        $('#create_software').modal();

        for (var i = 0; i < $('input[name=so]').length; i++) {
            $('input[name=so]')[i].setCustomValidity('Select at least one operating system');
        }

        this.tableView = new TableView({
            el: '#installedSoftware-table',
            actionsClass: "actionsSDCTier",
            headerClass: "headerSDCTier",
            bodyClass: "bodySDCTier",
            footerClass: "footerSDCTier",
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: function(){return[];},
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

        // catalogo
        this.tableViewNew = new TableView({
            el: '#newSoftware-table',
            actionsClass: "actionsSDCTier",
            headerClass: "headerSDCTier",
            bodyClass: "bodySDCTier",
            footerClass: "footerSDCTier",
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtonsNew,
            getMainButtons: function(){return[];},
            getHeaders: this.getHeadersNew,
            getEntries: this.getEntriesNew,
            disableActionButton: true,
            context: this,
            dropable: true,
            draggable: true,
            onDrag: this.onCatalogDrag,
            onDrop: this.onCatalogDrop
        });
        this.tableView.render();
        this.tableViewNew.render();
    
        return this;
    }
});