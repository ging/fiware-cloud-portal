var CreateProjectView = Backbone.View.extend({

    _template: _.itemplate($('#createProjectFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();
    },

    close: function(e) {
        $('#create_project').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_project').html() != null) {
            $('#create_project').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onCreate: function(e){
        var self = this;
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var enabled = this.$('input[name=enabled]').is(':checked');
        var project = new Project();
        project.set({'name': name});
        project.set({'description': descr});
        project.set({'enabled': enabled});
        var callbacks = UTILS.Messages.getCallbacks("Project "+project.get("name") + " created.", "Error creating project "+project.get("name"));
        var cbs = {};
        cbs.success = function(resp) {
            console.log("resp ", resp);
            var proj = resp.get('tenant').id;
            //TODO Add user to project
            var myId = Utils.Me().get('id');
            var roleReg;
            for (var idx in self.options.roles.models) {
                var role = self.options.roles.models[idx];
                if (role.get('name') === "admin") {
                    roleReg = role.get('id');
                }
            }
            if (roleReg) {
                Utils.Me().addRole(roleReg, proj, UTILS.Messages.getCallbacks("User added to project.", "Error adding user to project", {context: self}));
            }
        };
        cbs.error = callbacks.error;
        project.save(undefined, cbs);

    }

});