var ProjectView = Backbone.View.extend({

    _template: _.itemplate($('#projectsTemplate').html()),

    tableView: undefined,

    initialize: function() {
        var self = this;
        this.model.fetch();
        this.options.quotas.fetch();
        this.renderFirst();
        this.model.bind("sync", this.render, this);
        this.options.quotas.bind("reset", this.render, this);
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        // return [{
        //     label:  "Create New Project",
        //     action:    "create"
        // }];
        return [];
    },

    getDropdownButtons: function() {
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
        return [
        // {
        //     label:"Edit Project", action:"edit", activatePattern: oneSelected
        // },
        // {
        //     label: "Modify Users", action: "modify-users", activatePattern: oneSelected
        // },
        {
            label: "Modify Quotas", action: "modify-quotas", activatePattern: oneSelected
        }
        // ,
        // {
        //     label: "Delete Project", action:"delete", warn: true, activatePattern: groupSelected
        // }
        ];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [
            {
                type: "checkbox",
                size: "5%"
            },
            {
                name: "Name",
                tooltip: "Project's name",
                size: "35%",
                hidden_phone: false,
                hidden_tablet:false
            },
            {
                name: "Project Description",
                tooltip: "Project's Description",
                size: "50%",
                hidden_phone: true,
                hidden_tablet:false
            },
            {
                name: "Enabled",
                tooltip: "Check if the project is available to be used",
                size: "10%",
                hidden_phone: false,
                hidden_tablet:false
            }
        ];
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var project = this.model.models[index];
            var entry = {id: project.get('id'), cells: [{
                    value: project.get("name")
                },
                { value: project.get("description")
                },
                { value: project.get("enabled")
                }
                ]};
            entries.push(entry);
        }
        return entries;
    },

    onAction: function(action, projectIds) {
        var project, proj, subview, quotas;
        var self = this;
        if (projectIds.length === 1) {
            project = projectIds[0];
            proj = this.model.get(project);
        }
        switch (action) {
            case 'edit':
                subview = new EditProjectView({el: 'body', model:proj});
                subview.render();
                break;
            case 'modify-users':
                window.location.href = '#syspanel/projects/'+project+'/users/';
                break;
            case 'modify-quotas':
                var quota = new Quota();
                quota.set({'id': project});
                quota.fetch({success: function () {
                    subview = new ModifyQuotasView({el: 'body', model:quota, project:proj.attributes.name});
                    subview.render();
                }});                
                break;
            case 'create':
                subview = new CreateProjectView({el: 'body'});
                subview.render();
                break;
            case 'delete':
                subview = new ConfirmView({el: 'body', title: "Confirm Delete Project", btn_message: "Delete Project", onAccept: function() {
                    projectIds.forEach(function(project) {
                        proj = self.model.get(project);
                        proj.destroy(UTILS.Messages.getCallbacks("Project "+proj.get("name") + " deleted.", "Error deleting project "+proj.get("name")));
                    });
                }});
                subview.render();
                break;
        }
    },

    onClose: function() {
        this.tableView.close();
        this.options.quotas.unbind("reset");
        this.model.unbind("sync");
        this.undelegateEvents();
        this.unbind();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.tableView = new TableView({
            model: this.model,
            el: '#projects-table',
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