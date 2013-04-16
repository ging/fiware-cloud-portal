var QuotaView = Backbone.View.extend({

    _template: _.itemplate($('#quotasTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.model.fetch();
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
    },

    getDropdownButtons: function() {
        return [];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            name: "Name",
            tooltip: "Quota's name",
            size: "80%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Limit",
            tooltip: "Limits of the quota",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var attr;
        if (!this.model.models[0]) return entries;
        attr = this.model.models[0].attributes;
        entries.push({
            id: '0000',
            cells: [{
                value: "Metadata Items"
            }, {
                value: attr.metadata_items
            }]
        });
        entries.push({
            id: '0001',
            cells: [{
                value: "Injected File Content Bytes"
            }, {
                value: attr.injected_file_content_bytes
            }]
        });
        entries.push({
            id: '0002',
            cells: [{
                value: "Injected Files"
            }, {
                value: attr.injected_files
            }]
        });
        entries.push({
            id: '0003',
            cells: [{
                value: "Gigabytess"
            }, {
                value: attr.gigabytes
            }]
        });
        entries.push({
            id: '0004',
            cells: [{
                value: "Ram"
            }, {
                value: attr.ram
            }]
        });
        entries.push({
            id: '0005',
            cells: [{
                value: "Floating Ips"
            }, {
                value: attr.floating_ips
            }]
        });
        entries.push({
            id: '0006',
            cells: [{
                value: "Instances"
            }, {
                value: attr.instances
            }]
        });
        entries.push({
            id: '0007',
            cells: [{
                value: "Volumes"
            }, {
                value: attr.volumes
            }]
        });
        entries.push({
            id: '0008',
            cells: [{
                value: "Cores"
            }, {
                value: attr.cores
            }]
        });
        entries.push({
            id: '0009',
            cells: [{
                value: "Security Groups"
            }, {
                value: attr.security_groups
            }]
        });
        entries.push({
            id: '0010',
            cells: [{
                value: "Security Group Rules"
            }, {
                value: attr.security_group_rules
            }]
        });
        return entries;
    },

    onClose: function() {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("sync");
    },

    close: function() {
        this.onClose();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#quotas-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
    },

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }
});