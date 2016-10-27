var BPTemplate = Backbone.Model.extend({

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    _action:function(method, options) {
        var model = this;
        options = options || {};
        var error = options.error;
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        options.error = function(resp) {
            model.trigger('error', model, resp, options);
            if (error!==undefined) {
                error(model, resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    addTier: function(options) {
        options = options || {};
        return this._action('addTier', options);
    },

    updateTier: function(options) {
        options = options || {};
        return this._action('updateTier', options);
    },

    deleteTier: function(options) {
        options = options || {};
        return this._action('deleteTier', options);
    },

    sync: function(method, model, options) {
        var self = this;
        switch(method) {
            case "read":
                this.getTemplate(model.id, options.success, options.error, this.getRegion());
                break;
            case "create":
                JSTACK.Murano.createTemplate(model.toJSON().name, model.toJSON().description, function (resp) {

                    if (model.toJSON().tierDtos && model.toJSON().tierDtos.length !== 0) {
                        var created_callback = function () {
                            console.log('Tier created for cloning');
                        };
                        for (var t in model.toJSON().tierDtos) {
                            var tier = model.toJSON().tierDtos[t];

                            tier.productReleaseDtos = tier.productReleaseDtos_asArray;

                            self.createTier(resp.id, tier, created_callback, options.error);
                        }
                    }
                    options.success(resp);
                }, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Murano.deleteTemplate(model.id, options.success, options.error, this.getRegion());
                break;
            case "update":
                break;
            case "addTier":
                this.createTier(model.id, options.tier, options.success, options.error);    
                break;
            case "updateTier":
                JSTACK.Murano.updateBlueprintTemplateTier(model.id, options.tier, options.success, options.error, this.getRegion());
                break;
            case "deleteTier":
                JSTACK.Murano.deleteBlueprintTemplateTier(model.id, options.tier, options.success, options.error, this.getRegion());
                break;
        }
    },

    getTemplate: function (id, success, error, region) {
        JSTACK.Murano.getTemplate(id, function(result) {

            var info;

            result.tierDtos_asArray = [];
            for (var s in result.services) {
                // new tier
                if (typeof(result.services[s].instance) !== 'string') {

                    var inst = result.services[s].instance['?'];

                    info = {
                        id: result.services[s]['?'].id,
                        name: result.services[s].name,
                        fully_qualified_name: result.services[s]['?'].type
                    };
                    
                    var tier = {
                        id: inst.id,
                        name: result.services[s].instance.name,
                        flavour: result.services[s].instance.flavor,
                        image: result.services[s].instance.image,
                        keypair: result.services[s].instance.keypair,
                        productReleaseDtos_asArray: [{productName: result.services[s].name, version: '', info: info}]

                    };
                    result.tierDtos_asArray.push(tier);
                }
            }

            for (var s1 in result.services) {
                // product of already registered tier
                if (typeof(result.services[s1].instance) === 'string') {
                    for (var t in result.tierDtos_asArray) {
                        if (result.tierDtos_asArray[t].id === result.services[s1].instance) {
                            info = {
                                id: result.services[s]['?'].id,
                                name: result.services[s].name,
                                fully_qualified_name: result.services[s]['?'].type
                            };
                            var prod = {productName: result.services[s1].name, version: '', info: info};
                            result.tierDtos_asArray[t].productReleaseDtos_asArray.push(prod);
                        }
                    }
                }
            }

            success(result);

        }, error, region);
    },

    createTier: function (template_id, tier, success, error) {

        var instance_id = JSTACK.Utils.guid();

        var instance = {
            "flavor": tier.flavour, 
            "keypair": tier.keypair, 
            "image": tier.image, 
            "?": {
                "type": "io.murano.resources.ConfLangInstance",         
                "id":  instance_id
            }, 
            "name": tier.name
        };

        if (tier.networkDto) {
            instance.networks = {
                "useFlatNetwork": false, 
                "primaryNetwork": null, 
                "useEnvironmentNetwork": false, 
                "customNetworks": []
            };

            var net;

            for (var n in tier.networkDto) {
                if (tier.networkDto[n].networkId) {
                    // Network exists in Openstack
                    net = {
                        "internalNetworkName": tier.networkDto[n].networkName, 
                        "?": {
                            "type": "io.murano.resources.ExistingNeutronNetwork", 
                            "id": tier.networkDto[n].networkId
                        }
                    };

                    instance.networks.customNetworks.push(net);

                } else {
                    // New network created using an alias
                    net = {
                        "autoUplink": true, 
                        "name": tier.networkDto[n].networkName, 
                        "?": {
                            "type": "io.murano.resources.NeutronNetworkBase", 
                            "id": JSTACK.Utils.guid()
                        }, 
                        "autogenerateSubnet": true
                    };

                    instance.networks.customNetworks.push(net);
                }
            }
        }

        var services = tier.productReleaseDtos;

        if (services) {
            this.createServices(0, services, template_id, instance, instance_id, success, error);
        } else {
            options.error('No services selected');
        }

    },

    createServices: function (index, services, template_id, instance, instance_id, callback, error) {

        var self = this;

        if (index === services.length) {
            callback();
            return;
        }

        var inst;

        if (index === 0) inst = instance;
        else inst = instance_id;

        var ser = services[index];

        JSTACK.Murano.createService(template_id, ser.info, inst, function () {
            self.createServices(++index, services, template_id, instance, instance_id, callback, error);
        }, error, this.getRegion());

    },

    parse: function(resp) {
        //resp.id = resp.name;
        return resp;
    }
});

var BPTemplates = Backbone.Collection.extend({

    model: BPTemplate,

    catalogList: {},

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    _action: function(method, options) {
        var model = this;
        options = options || {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    getCatalogBlueprint: function(options) {
        options = options || {};
        var bp = new BPTemplate();
        bp.set({'id': options.id});
        return bp._action('read', options);
    },

    sync: function(method, model, options) {
        var self = this;
        switch(method) {
            case "read":
                JSTACK.Murano.getTemplateList(function (templates) {
                    var owned_or_public_templates = [];
                    for (var t in templates) {
                        if (UTILS.Auth.getCurrentTenant().id === templates[t].tenant_id || templates[t].is_public) {
                            templates[t].description = templates[t].description_text;
                            owned_or_public_templates.push(templates[t]);
                        }
                    }
                    self.getTemplateTiers(0, owned_or_public_templates, options.success, options.error);
                }, options.error, this.getRegion());
                break;
            case 'getCatalogBlueprint':
                // JSTACK.Murano.getBlueprintCatalog(options.id, options.success, options.error);
                break;
        }
    },

    getTemplateTiers: function (index, templates, callback, error) {

        var self = this;

        if (index === templates.length) {
            var owned_templates = [];
            self.catalogList = [];

            for (var t in templates) {
                if (UTILS.Auth.getCurrentTenant().id === templates[t].tenant_id) {
                    owned_templates.push(templates[t]);
                }
                if (templates[t].is_public) {
                    self.catalogList.push(templates[t]);
                }
            }
            callback(owned_templates);
            return;
        }

        var bp = new BPTemplate();

        bp.getTemplate(templates[index].id, function(result) {
            templates[index] = result;
            self.getTemplateTiers(++index, templates, callback, error);
        }, error, this.getRegion());
    },

    parse: function(resp) {
        return resp;
    }
});