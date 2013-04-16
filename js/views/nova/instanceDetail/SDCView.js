var InstanceSDCView = Backbone.View.extend({

    _template: _.itemplate($('#instanceSDCTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,

    initialize: function() {

        this.model.bind("sync", this.render, this);
        this.model.fetch();

        this.options.instanceModel.bind("change", this.render, this);
        this.options.instanceModel.fetch();

        this.renderFirst();
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
            },
            {
            label: "Edit attributes",
            action: "edit",
            activatePattern: oneSelected
        }];
    },

    getHeaders: function() {
        return [{
            type: "checkbox",
            size: "10%"
        }, {
            name: "Name",
            tooltip: "Software name",
            size: "55%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Software state",
            size: "35%",
            hidden_phone: true,
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

            console.log('PPP', products, id);

            for (var product in products) {
                var stat = products[product].get('status');
                if (products[product].get('vm').fqn === id) {// && stat !== 'ERROR' && stat !== 'UNINSTALLED') {
                    entries.push({id:products[product].get('name'), cells:[
                    {value: products[product].get('productRelease').product.name},
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
        },
        {
            label: "View attributes",
            action: "view",
            activatePattern: oneSelected
        }];
    },

    getHeadersNew: function() {
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Name",
            tooltip: "Software name",
            size: "40%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Description",
            tooltip: "Software description",
            size: "55%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntriesNew: function() {
        var entries = [];

        if (this.model.models.length === 0) {
            return entries;
        }

        var products = this.model.catalogueList;

        console.log('papapappapa', this.model);

        for (var product in products) {
            entries.push({id:products[product].name, cells:[
                {value: products[product].name},
                {value: products[product].description}]});
        }
        return entries;

    },

    onClose: function() {
        this.tableView.close();
        this.tableViewNew.close();
        this.model.unbind("sync");
        this.options.instanceModel.unbind("change");
        this.unbind();
        this.undelegateEvents();
    },

    onAction: function(action, ids) {

        var ip = this.options.instanceModel.get("addresses")["private"][0].addr;
        var fqn = this.options.instanceModel.get("id");

        console.log("vaaaaaaaaaa", action, ids, ip);

        var product;

        switch (action) {
            case 'install':

                product = new SDC();

                product.set({"ip": ip});
                product.set({"product": {name: ids[0]}});
                product.set({"fqn": fqn});

                product.save(undefined, {success: function (model, resp) {
                    console.log('Success Installing ', model, resp);
                }, error: function (model, e) {
                    console.log('Error installing ', e);
                }});
                break;
            case 'uninstall':

                //var product = this.model.get(ids[0]);
                product = this.model.findWhere({name: ids[0]});
                console.log('UNISNDT', product);
                product.destroy({success: function (model, resp) {
                    console.log('Success uninstalling ', resp);
                }, error: function (model, e) {
                    console.log('Error uninstalling ', e);
                }});
                break;
            case 'view':

                this.model.getCatalogueProductDetails({id: ids[0], callback: function (resp) {
                    subview = new ViewProductAttributesView({el: 'body', productAttributes: resp});
                    subview.render();  
                }, error: function (model, e) {
                    console.log('Error attr ', e);
                }});

                              
                break;
            case 'edit':
                product = this.model.findWhere({name: ids[0]});
                product.fetch({success: function (model, resp) {
                    var attr = resp.productRelease.product.attributes_asArray;
                    subview = new EditProductAttributesView({el: 'body', model: this.model, productAttributes: attr});
                    subview.render();
                }, error: function (model, e) {
                    console.log('Error attr ', e);
                }});
                //getProductInstance(id)
                //reconfigureProductInstance(id, att)

                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#installedSoftware-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });

        this.tableViewNew = new TableView({
            model: this.model,
            el: '#newSoftware-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtonsNew,
            getMainButtons: this.getMainButtonsNew,
            getHeaders: this.getHeadersNew,
            getEntries: this.getEntriesNew,
            context: this
        });

        this.tableView.render();
        this.tableViewNew.render();
    },

    render: function() {
      var product = this.model;
            if ($(this.el).html() !== null) {
            this.tableView.render();
            this.tableViewNew.render();
        }
        return this;
    }
});