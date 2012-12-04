var EditSecurityGroupRulesView = Backbone.View.extend({
    
    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #deleteRuleBtn': 'deleteRule',
      'click #deleteRulesBtn': 'deleteRules',
      'click #close': 'close',
      'click #createRuleBtn': 'createRule',
      'click .modal-backdrop': 'close',
      'change .secGroupSelect': 'dissapearCIDR',
      'change .IPProtocolSelect': 'changeInputs',
      'change .checkbox_sec_group_rule':'enableDisableDeleteButton',         
    },
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).append(this._template({securityGroupsModel: this.options.securityGroupsModel}));
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        $('#create_security_group').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();	
    },
    
    dissapearCIDR: function(e) {
    	if ($('.secGroupSelect :selected').val()!=='CIDR') {
    		$('.cidrSelect').hide();
    	}else {
    		if ($('.cidrSelect:hidden')) {
    			$('.cidrSelect').show();
    		}	
    	}    	
    },
    
    changeInputs: function(e) {
    	if ($('.IPProtocolSelect :selected').val()=='ICMP') {
    		$("label[for='from_port']").text("Type");
    		$("label[for='to_port']").text("Code");
    	}else {
    		$("label[for='from_port']").text("From Port");
    		$("label[for='to_port']").text("To Port");
    	}    	
    },
    
    deleteRule: function (e) {
    	self = this;
    	var secGroupRuleId = e.target.value;
    	
		for (var index in this.options.securityGroupsModel.securityGroup.attributes.rules) {
        	 if (this.options.securityGroupsModel.securityGroup.attributes.rules[index].id == e.target.value) {
        	 	var secGroupRule = this.options.securityGroupsModel.securityGroup.attributes.rules[index]; 
        	 	console.log(secGroupRule);
        	 }        	 
        };
    	var securityGroupRule = secGroupRule;
    	console.log(self.options.securityGroupsModel.securityGroup);
    	var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rule", btn_message: "Delete Security Group Rule", onAccept: function() {        
            //self.options.securityGroupsModel.securityGroup.deleteSecurityGroupRule(secGroupRuleId);
            var subview = new MessagesView({el: '#content', state: "Success", title: "Security Group Rule deleted."});     
        	subview.render();
        }});
        subview.render();
        
    },
    
    
    deleteRules: function(e) {

		var self = this;        
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rules", btn_message: "Delete Security Group Rules", onAccept: function() {
            $(".checkbox_sec_group_rule:checked").each(function () {
            	console.log(self.options);
                    var secGroupRuleId = $(this).val(); 
                    console.log(secGroupRuleId);
                    for (var index in self.options.securityGroupsModel.securityGroup.attributes.rules) {
			        	 if (self.options.securityGroupsModel.securityGroup.attributes.rules[index].id == secGroupRuleId) {
			        	 	var secGroupRule = self.options.securityGroupsModel.securityGroup.attributes.rules[index]; 
			        	 	console.log(secGroupRule);
			        	 }        	 
			        };
                    
            var subview = new MessagesView({el: '#content', state: "Success", title: "Security Group Rules deleted."});     
        	console.log("deleting sec group");
        	//self.options.securityGroupsModel.securityGroup.deleteSecurityGroupRule(secGroupRuleId);
        	subview.render();
            });
        }});
        subview.render();
       
    },   
    
    createRule: function(e) {
    	self = this;
    	var cidr_pattern = /^([0-255]){1,3}(\.){1}([0-255]){1,3}(\.){1}([0-255]){1,3}(\.){1}([0-255]){1,3}(\/){1}([0-24]){1,2}$/;   // 0.0.0.0/0
    	var portPattern = /^([1-65535]){1,5}$/;
    	var icmpPattern = /^([-1-255]){1,3}$/;
    	
    	var parentGroupId = e.target.value; 
		var ipProtocol = $('.IPProtocolSelect :selected').val();
        var fromPort = $('input[name=fromPort]').val();
        var toPort = $('input[name=toPort]').val();
        var securityGroupId = $('.secGroupSelect :selected').val();
        var cidr = $('input[name=cidr]').val();	
        
        if (cidr_pattern.test(cidr) ) {
			var cidrOK = true;			
		}else{			
			$('.help-inline').append('Enter a valid value');
		}
		
		if (portPattern.test(fromPort) ) {
			var fromPortOK = true;			
		}
		
		if (portPattern.test(toPort) ) {
			var toPortOK = true;			
		}
        
        console.log("ipProtocol "+ipProtocol);
        console.log("fromPort "+fromPort);
        console.log("toPort "+toPort);
        console.log("cidr "+cidr);
        console.log("securityGroupId "+securityGroupId);
        console.log("parentGroupId "+parentGroupId); 
        
        if ( cidrOK && fromPortOK && toPortOK ) {  
        	console.log(cidrOK && fromPortOK && toPortOK);
        	if ($('.secGroupSelect :selected').val()!=='CIDR') {    
        		console.log("no cidr");
        		//(ip_protocol, from_port, to_port, cidr, group_id, parent_group_id, options)
            	self.options.securityGroupsModel.securityGroup.createSecurityGroupRule(ipProtocol, fromPort, toPort, "", securityGroupId, parentGroupId); 
        	}else{
        		console.log("cidr");
           		self.options.securityGroupsModel.securityGroup.createSecurityGroupRule(ipProtocol, fromPort, toPort, cidr, "" , parentGroupId); 
           	}
        var subview = new MessagesView({el: '#content', state: "Success", title: "Security group rule created."});     
        subview.render();
       	this.close();
        }else{
        	console.log("Wrong values for fromPort, toPort or CDIR");
        }
       
    },
    
    enableDisableDeleteButton: function (e) {
    	console.log("enable button");
        if ($(".checkbox_sec_group_rule:checked").size() > 0) { 
            $("#deleteRulesBtn").attr("disabled", false);
        } else {
            $("#deleteRulesBtn").attr("disabled", true);
        }        
    },
    
});