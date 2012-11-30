var CreateSecurityGroupView = Backbone.View.extend({
    
    _template: _.itemplate($('#createSecurityGroupFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'create',
      'click .modal-backdrop': 'close',         
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
    
    create: function(e) {
    	self = this;
        var name = $('input[name=name]').val();
        var description = $('input[name=description]').val();
        var newSecurityGroup = new SecurityGroup();        
            newSecurityGroup.set({'name': name, 'description': description});
            newSecurityGroup.save();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Security group "+name+" created."});     
        subview.render();
        this.close();
    }
    
});