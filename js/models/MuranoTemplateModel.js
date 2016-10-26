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
        switch(method) {
            case "read":
                JSTACK.Murano.getTemplate(model.id, function(result) {

                    result.tierDtos_asArray = [];
                    for (var s in result.services) {
                        // new tier
                        if (typeof(result.services[s].instance) !== 'string') {

                            var inst = result.services[s].instance['?'];
                            
                            var tier = {
                                id: inst.id,
                                name: result.services[s].instance.flavor,
                                flavour: result.services[s].instance.flavor,
                                image: result.services[s].instance.image,
                                keypair: result.services[s].instance.keypair,
                                productReleaseDtos_asArray: [{productName: result.services[s].name, version: ''}]

                            };
                            result.tierDtos_asArray.push(tier);
                        }
                    }

                    for (var s1 in result.services) {
                        // product of already registered tier
                        if (typeof(result.services[s1].instance) === 'string') {
                            for (var t in result.tierDtos_asArray) {
                                if (result.tierDtos_asArray[t].id === result.services[s1].instance) {
                                    var prod = {productName: result.services[s1].name, version: ''};
                                    result.tierDtos_asArray[t].productReleaseDtos_asArray.push(prod);
                                }
                            }
                        }
                    }

                     options.success(result);

                }, options.error, this.getRegion());

                break;
            case "create":
                JSTACK.Murano.createTemplate(model.toJSON().name, model.toJSON().description, options.success, options.error, this.getRegion());
                break;
            case "delete":
                JSTACK.Murano.deleteTemplate(model.id, options.success, options.error, this.getRegion());
                break;
            case "update":
                break;
            case "addTier":


                var tier = options.tier;
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
                    this.createServices(0, services, model.id, instance, instance_id, options.success, options.error);
                } else {
                    options.error('No services selected');
                }
                break;
            case "updateTier":
                JSTACK.Murano.updateBlueprintTemplateTier(model.id, options.tier, options.success, options.error, this.getRegion());
                break;
            case "deleteTier":
                JSTACK.Murano.deleteBlueprintTemplateTier(model.id, options.tier, options.success, options.error, this.getRegion());
                break;
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
        return this._action('getCatalogBlueprint', options);
    },

    fetchCollection: function(options) {

        var self = this;

        JSTACK.Murano.getBlueprintCatalogList(function (resp) {
            JSTACK.Murano.getBlueprintTemplateList(function (resp2) {
                self.catalogList = resp;
                options.success(resp2);
            }, options.error);

        }, options.error);
    },

    sync: function(method, model, options) {
        var self = this;
        switch(method) {
            case "read":
                // BlueprintCatalogue not available yet
                //this.fetchCollection(options);
                JSTACK.Murano.getTemplateList(function (templates) {
                    var owned_templates = [];
                    for (var t in templates) {
                        if (UTILS.Auth.getCurrentTenant().id === templates[t].tenant_id) {
                            templates[t].description = templates[t].description_text;
                            owned_templates.push(templates[t]);
                        }
                    }
                    self.getTemplateTiers(0, owned_templates, options.success, options.error);
                }, options.error, this.getRegion());
                break;
            case 'getCatalogBlueprint':
                JSTACK.Murano.getBlueprintCatalog(options.id, options.success, options.error);
                break;
        }
    },

    getTemplateTiers: function (index, templates, callback, error) {

        var self = this;

        if (index === templates.length) {
            callback(templates);
            return;
        }

        JSTACK.Murano.getTemplate(templates[index].id, function(result) {

            templates[index].tierDtos_asArray = [];
            for (var s in result.services) {
                // new tier
                if (typeof(result.services[s].instance) !== 'string') {

                    var inst = result.services[s].instance['?'];
                    
                    var tier = {
                        id: inst.id,
                        name: result.services[s].instance.flavor,
                        flavour: result.services[s].instance.flavor,
                        image: result.services[s].instance.image,
                        keypair: result.services[s].instance.keypair,
                        productReleaseDtos_asArray: [{productName: result.services[s].name, version: ''}]

                    };
                    templates[index].tierDtos_asArray.push(tier);
                }
            }

            self.getTemplateTiers(++index, templates, callback, error);

        }, error, this.getRegion());

    },

    parse: function(resp) {
        return resp;
    }
});