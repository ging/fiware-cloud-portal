var EditSecurityGroupRulesView = Backbone.View.extend({
    
    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'create',
      'click .modal-backdrop': 'close',
         
    },
    
    initialize: function() {
    },
    
    render: function () {
		console.log(this.options.securityGroupsModel.models);
       /* if ($('#create_security_group').html() != null) {
            return;
        }*/
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
    	console.log(self.options.securityGroupsModel);
        var name = $('input[name=name]').val();
        var description = $('input[name=description]').val();
        //console.log(name);
        //console.log(description);
        var newSecurityGroup = new SecurityGroup();        
            newSecurityGroup.set({'name': name, 'description': description});
            newSecurityGroup.save();
        //self.options.securityGroupsModel.createsecuritygroup(name, description, options.success); 
        var subview = new MessagesView({el: '#content', state: "Success", title: "Security group "+name+" created."});     
        subview.render();
        this.close();
    }
    
});