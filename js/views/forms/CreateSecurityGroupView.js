var CreateSecurityGroupView = Backbone.View.extend({

    _template: _.itemplate($('#createSecurityGroupFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'submit #form': 'createSecurityGroup',
      'click .modal-backdrop': 'close',
      'click #name': 'showTooltipName',
      'input input': 'onInput'
    },

    render: function () {
        $(this.el).append(this._template({securityGroupsModel: this.options.securityGroupsModel}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        this.options.securityGroupsModel.unbind("change", this.render, this);
        $('#create_security_group').remove();
        $('.modal-backdrop').remove();
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

        for (var index in self.options.securityGroupsModel.models) {
            if (self.options.securityGroupsModel.models[index].attributes.name === name) {
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
            for (var index in self.options.securityGroupsModel.models) {
                if (self.options.securityGroupsModel.models[index].attributes.name === name) {
                    subview = new MessagesView({el: '#content', state: "Error", title: "Security Group "+name+" already exists. Please try again."});
                    subview.render();
                    return;
                }
            }
            var newSecurityGroup = new SecurityGroup();
            newSecurityGroup.set({'name': name, 'description': description});
            newSecurityGroup.save();
            subview = new MessagesView({el: '#content', state: "Success", title: "Security group "+name+" created."});
            subview.render();
        } else {
            subview = new MessagesView({el: '#content', state: "Error", title: "Wrong values for Security Group. Please try again."});
            subview.render();
        }
        self.close();
    }

});