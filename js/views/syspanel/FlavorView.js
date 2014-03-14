var FlavorView = Backbone.View.extend({

    _template: _.itemplate($('#flavorsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        //this.options.isProjectTab.unbind("reset");
        //this.options.isProjectTab.bind("reset", this.render, this);
        this.renderFirst();
    },

    onClose: function() {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("sync", this.render, this);
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        var btns = [];
        if (!this.options.isProjectTab) {
            btns.push({
                label:  "Create Flavor",
                action:    "create"
            });
        }
        return btns;
    },

    getDropdownButtons: function() {
        var btns = [];
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        if (!this.options.isProjectTab) {
            btns.push({
                label:"Delete Flavor",
                action:"delete",
                warn: true,
                activatePattern: groupSelected
            });
        }
        return btns;
    },

    getHeaders: function() {
        var btns = [
            {
                name: "ID",
                tooltip: "Flavor's identifier",
                size: "5%",
                hidden_phone: true,
                hidden_tablet:false
            },
            {
                name: "Name",
                tooltip: "Flavor's name",
                size: "35%",
                hidden_phone: true,
                hidden_tablet:false
            },
            {
                name: "VCPUs",
                tooltip: "Number of virtual CPUs",
                size: "5%",
                hidden_phone: false,
                hidden_tablet:false
            },
            {
                name: "Memory",
                tooltip: "RAM availability",
                size: "10%",
                hidden_phone: false,
                hidden_tablet:false
            },
            {
                name: "User Disk",
                tooltip: "User disk availability",
                size: "10%",
                hidden_phone: true,
                hidden_tablet:false
            },
            {
                name: "Ephemeral Disk",
                tooltip: "Ephemeral disk availability",
                size: "15%",
                hidden_phone: true,
                hidden_tablet:false
            }
        ];
        if (!this.options.isProjectTab) {
            btns.splice(0,0, {
                type: "checkbox",
                size: "5%"
            });
        }
        return btns;
    },

    getEntries: function() {
        var i = 0;
        var entries = [];
        for (var index in this.model.models) {
            i++;
            var flavor = this.model.models[index];



            var entry = {id: flavor.get('id'), cells: [{
                  value: parseInt(flavor.get("id"), 10)
                },
                { value: flavor.get("name")
                },
                { value: flavor.get("vcpus")
                },
                { value: flavor.get("ram")
                },
                { value: flavor.get("disk")
                },
                { value: flavor.get('OS-FLV-EXT-DATA:ephemeral') || flavor.get('ephemeral')
                }
                ]};
            entries.push(entry);
        }
        return entries;
    },

    onAction: function(action, flavorIds) {
        var flavor, flav, subview;
        var self = this;
        if (flavorIds.length === 1) {
            flavor = flavorIds[0];
            flav = this.model.get(flavor);
        }
        switch (action) {
            case 'delete':
                subview = new ConfirmView({el: 'body', title: "Delete Flavor", btn_message: "Delete Flavor", onAccept: function() {
                    flavorIds.forEach(function(flavor) {
                        flav = self.model.get(flavor);
                        flav.destroy(UTILS.Messages.getCallbacks("Flavor " + flav.get("name") + " deleted", "Error deleting flavor " + flav.get("name")));
                    });
                }});
                subview.render();
                break;
            case 'create':
                view = new CreateFlavorView({model: new Flavor(), el: 'body', flavors: self.model});
                view.render();
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {models: this.model.models, isProjectTab:this.options.isProjectTab});
        this.tableView = new TableView({
            model: this.model,
            el: '#flavors-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
    },

    render: function () {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }

});