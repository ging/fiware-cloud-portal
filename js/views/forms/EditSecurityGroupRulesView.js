var EditSecurityGroupRulesView = Backbone.View.extend({
    
    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #deleteRuleBtn': 'deleteRule',
      'click #deleteRulesBtn': 'deleteRules',
      'click #close': 'close',
      'click #createRuleBtn': 'createRule',
      'click .modal-backdrop': 'close',
         
    },
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).append(this._template({securityGroupsModel: this.options.securityGroupsModel}));
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        //this.options.securityGroupsModel.unbind("change", this.render, this);
        $('#create_security_group').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },
    
    deleteRule: function (e) {
    	self = this;
    	var secGroupRuleId = e.target.value;
		for (var index in this.options.securityGroupsModel.securityGroup.attributes.rules) {
        	 if (this.options.securityGroupsModel.securityGroup.attributes.rules[index].id == e.target.value) {
        	 	var secGroupRule = this.options.securityGroupsModel.securityGroup.attributes.rules[index]; 
        	 }        	 
        };
    	var securityGroupRule = secGroupRule;
    	var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rule", btn_message: "Delete Security Group Rule", onAccept: function() {        
            self.options.securityGroupsModel.securityGroup.deleteSecurityGroupRule(secGroupRuleId);
            var subview = new MessagesView({el: '#content', state: "Success", title: "Security Group Rule deleted."});     
        	subview.render();
        }});
        subview.render();
    },
    
    deleteRules: function () {
    	
    },    
    
    createRule: function(e) {
    	self = this;
    	//console.log(self.options.securityGroupsModel);
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