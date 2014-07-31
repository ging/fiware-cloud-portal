var CreateSecurityGroupView = Backbone.View.extend({

    _template: _.itemplate($('#createSecurityGroupFormTemplate').html()),

    events: {
      'click #create_security_group #cancelBtn': 'close',
      'click #create_security_group #close': 'close',
      'submit #create_security_group #form': 'createSecurityGroup',
      'click .modal-backdrop:last': 'close',
      'click #name': 'showTooltipName',
      'input input': 'onInput'
    },

    render: function (options) {
        $(this.el).append(this._template({securityGroupsModel: this.model}));
        $('#create_security_group').modal(options);
        return this;
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_security_group + .modal-backdrop:last').remove();
        $('#create_security_group').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    showTooltipName: function() {
        $('#name').tooltip('show');
    },

    onInput: function (e) {
        e.preventDefault();
        self = this;
        var name = $('input[name=name]').val();
        var message = '';

        for (var index in self.model.models) {
            if (self.model.models[index].get('name') === name) {
                message = "Security group already exists";
            }
        }
        this.$('input[name=name]')[0].setCustomValidity(message);

    },

    createSecurityGroup: function(e) {
        e.preventDefault();
        self = this;
        var namePattern = /^[a-z0-9_\-]{1,87}$/;
        var name = $('input[name=name]').val();
        var description = $('input[name=description]').val();
        var nameOK, descriptionOK, subview;

        nameOK = namePattern.test(name) ? true : false;

        descriptionOK = (description !== "" && description !== undefined) ? true : false;

        if (nameOK && descriptionOK) {
            for (var index in self.model.models) {
                if (self.model.models[index].get('name') === name) {
                    subview = new MessagesView({state: "Error", title: "Security Group "+name+" already exists. Please try again."});
                    subview.render();
                    return;
                }
            }
            var newSecurityGroup = new SecurityGroup();
            newSecurityGroup.set({'name': name, 'description': description});
            newSecurityGroup.save(undefined, UTILS.Messages.getCallbacks("Security group "+name + " created.", "Error creating security group "+name, {context: self, success: function() {
                if (self.options.callback !== undefined) {
                    self.options.callback(true);
                }    
            }, error: function() {
                if (self.options.callback !== undefined) {
                    self.options.callback(false);
                }  
            }}));
            
        } else {
            subview = new MessagesView({state: "Error", title: "Wrong values for Security Group. Please try again."});
            subview.render();
            if (self.options.callback !== undefined) {
                self.options.callback(false);
            }
            self.close();
        }
    }

});