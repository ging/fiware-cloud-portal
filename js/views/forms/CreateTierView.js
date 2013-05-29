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
        'click #btn-apply-icon': 'applyIcon'
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();

        this.addedProducts = [];
        this.editing = -1;
    },

    close: function(e) {
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
        var min = parseInt($('#tier-min-value').val(), 0);
        var max = parseInt($('#tier-max-value').val(), 0);
        var dial = this.dial[0];

        if (min > max) {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("Max value should be greater than min value");
            return;
        } else {
            this.$('input[name=tier-max-value]')[0].setCustomValidity("");
        }

        dial.o.min = min;
        dial.o.max = max;


        if (dial.cv > dial.o.max) {
            dial.cv = dial.o.max;
        } else if (dial.cv < dial.o.min) {
            dial.cv = dial.o.min;
        }
        dial.v = dial.cv;
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
                var exists = false;
                for (var a in this.addedProducts) {
                    if (this.addedProducts[a].name === product.name) {
                        exists = true;
                        continue;
                    }
                }
                if (!exists) {

                    this.options.sdcs.getCatalogueProductReleases({name: product.name, callback: function (resp) {
                        var lastRelease = resp.productRelease_asArray[0].version;

                        product.version = lastRelease;
                        self.addedProducts.push(product);
                        self.tableView.render();
                    }});

                }

            break;
            case 'uninstall':
                this.addedProducts.splice(ids, 1);
                this.tableView.render();
            break;
            case 'edit':
                product = this.addedProducts[ids];
                this.edit = ids;
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

        var tier = {
            name: name,
            flavour: flavorReg,
            floatingip: public_ip,
            image: image,
            icono: icon,
            keypair: key_name,
            minimumNumberInstances: min,
            maximumNumberInstances: max,
            initialNumberInstances: initial
        };

        if (this.addedProducts.length !== 0) {

            tier.productReleaseDtos = [];
            for (var p in this.addedProducts) {
                var nP = {productName: this.addedProducts[p].name, version: this.addedProducts[p].version};
                if (this.addedProducts[p].attributes_asArray) {
                    nP.attributes = [];
                    for (var at in this.addedProducts[p].attributes_asArray) {
                        var inp = 'input[name=attr_'+ this.addedProducts[p].name+'_'+ at+']';
                        var attrib = {key: this.addedProducts[p].attributes_asArray[at].key, value: this.addedProducts[p].attributes_asArray[at].value};
                        nP.attributes.push(attrib);
                    }
                }
                tier.productReleaseDtos.push(nP);
            }
        }

        var options = UTILS.Messages.getCallbacks("Tier "+name + " created.", "Error creating tier "+name, {context: self});

        options.tier = tier;

        var cb2 = options.callback;

        options.callback = function () {
            cb2();
            self.options.callback();
        };

        this.model.addTier(options);
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