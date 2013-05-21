var CreateTierView = Backbone.View.extend({

    _template: _.itemplate($('#createTierFormTemplate').html()),

    tableView: undefined,
    tableViewNew: undefined,

    dial: undefined,

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click .close': 'close',
        'click .modal-backdrop': 'close',
        'change .tier-values': 'onInput',
        'click #cancel-attrs': 'cancelAttrs',
        'click #accept-attrs': 'acceptAttrs',
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();

        this.addedProducts = [];
    },

    close: function(e) {
        console.log(e);
        this.onClose();
    },

    onClose: function () {
        $('#create_tier').remove();
        $('.modal-backdrop').remove();
        this.tableView.close();
        this.tableViewNew.close();
        this.unbind();
        this.undelegateEvents();
    },

    onInput: function() {
        var min = $('#tier-min-value').val();
        var max = $('#tier-max-value').val();
        var dial = this.dial[0];

        if (min > max) {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("Max value should be greater than min value");
            return;
        } else {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("");
        }

        dial.o.min = parseInt(min);
        dial.o.max = parseInt(max);


        if (dial.cv > dial.o.max) {
            dial.cv = dial.o.max;
        } else if (dial.cv < dial.o.min) {
            dial.cv = dial.o.min;
        }
        dial.v = dial.cv;
        console.log(min, max, dial.cv);
        dial._draw();
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
            label: "Remove",
            action: "uninstall",
            activatePattern: groupSelected
        }, {
            label: "Edit Attributes",
            action: "edit",
            activatePattern: oneSelected
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
                    {value: this.addedProducts[product].name}
                    ]
                });

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
            label: "Add",
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

        var products = this.options.sdcs.catalogueList;

        console.log(products);

        for (var product in products) {
              entries.push(

                {id: product, cells:[
                {value: products[product].name}]});

        }
        return entries;

    },

    onAction: function(action, ids) {

        var self = this;

        var product;

        switch (action) {
            case 'install':
                product = this.options.sdcs.catalogueList[ids];
                console.log(ids, product);
                this.addedProducts.push(product);
                this.tableView.render();
            break;
            case 'uninstall':
                this.addedProducts.splice(ids, 1);
                this.tableView.render();
            break;
            case 'edit':
            var productAttributes = [{key:'key1', value: 'value1', description: "descr1"}, {key:'key2', value: 'value2', description: "descr2"}];
            var str='';
            for (var i in productAttributes) {
                attr = productAttributes[i];
                str += '<tr id="sec_groups__row__" class="ajax-update status_down"><td>'+attr.key+'</td><td><input type="text" name="attr_'+i+'" value="'+attr.value+'""></td><td>'+attr.description+'</td></tr>';
            }
            $('#software-attrs-table').html(str);
            $('#scroll-based-layer').animate({
                scrollLeft: $('#scroll-based-layer').width()
            }, 500, function() {
                // Animation complete.
            });
            var effects = {};
            effects["-webkit-filter"] = "blur(1px)";
            effects["opacity"] = "0.3";
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
        effects["opacity"] = "1";
        $('.blurable').animate(effects, 500, function() {
            $('.blurable').removeClass("blur");
            $('.blurable').unbind("click", false);
        });
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

    onCreate: function(e){
        var self = this;
        e.preventDefault();
        var name, flavorReg, key_name, image, public_ip, min, max, initial;

        name = this.$('input[name=name]').val();

        flavorReg = $("#id_flavor option:selected")[0].value;

        image = $("#id_image option:selected")[0].value;

        image = $("#id_image option:selected")[0].value;

        icon = this.$('input[name=icon]').val();

        if ($("#id_keypair option:selected")[0].value !== '') {
            key_name = $("#id_keypair option:selected")[0].value;
        }

        public_ip = ($('input[name=public_ip]:checked').length > 0);

        min = this.$('input[name=tier-min-value]').val();

        max = this.$('input[name=tier-max-value]').val();

        initial = this.$('input[name=tier-initial-value]').val();

        console.log(name, flavorReg, image, icon, key_name, public_ip, min, max, initial);

        var tier = {
            name: name,
            flavour: flavorReg,
            floatingip: public_ip,
            image: image,
            icon: icon,
            keypair: key_name,
            minimum_number_instances: min, 
            maximum_number_instances: max,
            initial_number_instances: initial
        };

        var options = UTILS.Messages.getCallbacks("Tier "+name + " created.", "Error creating tier "+name, {context: self});

        options.tier = tier;

        //this.model.addTier(options);
    },

    render: function () {
        if ($('#create_tier').html() !== null) {
            $('#create_tier').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model, flavors: this.options.flavors, keypairs: this.options.keypairs, images: this.options.images}));
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
            context: this
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
            context: this
        });
        this.tableView.render();
        this.tableViewNew.render();
        $('.modal:last').modal();
        this.dial = $(".dial-form").knob();
        return this;
    }

});