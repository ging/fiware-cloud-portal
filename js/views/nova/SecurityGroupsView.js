var NovaSecurityGroupsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaSecurityGroupsTemplate').html()),
    
    initialize: function() {
        this.options.securityGroupsModel.unbind("reset");   
        this.options.securityGroupsModel.bind("reset", this.render, this);
       	this.renderFirst();
    },
    
    events: {
    	'change .checkbox_sec_groups':'enableDisableDeleteButton',
        'click .btn-create-sec-group':'createSecurityGroup',
        'click .btn-edit':'editSecurityGroupRules',
        'click #sec_groups_delete':'deleteSecurityGroups',
      	'click #sec_delete':'deleteSecurityGroup'      	
    },
    
    onClose: function() {
        //this.options.securityGroupsModel.unbind("reset");
        this.undelegateEvents();
        this.unbind();
    },
  
    createSecurityGroup: function (e) {
    	var subview = new CreateSecurityGroupView({el: 'body', securityGroupsModel: this.options.securityGroupsModel});
        subview.render();    	
    }, 
    
    editSecurityGroupRules: function (e) {
    	var securityGroup;
        for (var index in this.options.securityGroupsModel.models) {
        	 if (this.options.securityGroupsModel.models[index].id == e.target.value) {
        	 	var securityGroup = this.options.securityGroupsModel.models[index]; 
        	 }        	 
        };
        this.options.securityGroup = securityGroup;
    	var subview = new EditSecurityGroupRulesView({el: 'body', securityGroupsModel: this.options});
        subview.render();    	
    }, 

     deleteSecurityGroup: function (e) {
		var secGroup;
        for (var index in this.options.securityGroupsModel.models) {
        	 if (this.options.securityGroupsModel.models[index].id == e.target.value) {
        	 	var securityGroup = this.options.securityGroupsModel.models[index]; 
        	 }        	 
        };
        secGroup = securityGroup;
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group", btn_message: "Delete Security Group", onAccept: function() {
            secGroup.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Security Group "+secGroup.attributes.name+" deleted."});     
        	subview.render();
        }});
        subview.render();    
    },

     deleteSecurityGroups: function(e) {
     	var secGroup;
		var self = this;        
        var subview = new ConfirmView({el: 'body', title: "Delete Security Groups", btn_message: "Delete Security Groups", onAccept: function() {
            $(".checkbox_sec_groups:checked").each(function () {
                    var secGroupId = $(this).val(); 
                    for (var index in self.options.securityGroupsModel.models) {
			        	 if (self.options.securityGroupsModel.models[index].id == secGroupId) {
			        	 	var securityGroup = self.options.securityGroupsModel.models[index]; 
			        	 }        	 
			        };
                    secGroup = securityGroup;
                    secGroup.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Security Groups "+secGroup.attributes.name+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },

    
    enableDisableDeleteButton: function (e) {
        if ($(".checkbox_sec_groups:checked").size() > 0) { 
            $("#sec_groups_delete").attr("disabled", false);
        } else {
            $("#sec_groups_delete").attr("disabled", true);
        }        
    },

    renderFirst: function () {
    	this.undelegateEvents();
    	var that = this;
    	UTILS.Render.animateRender(this.el, this._template, {securityGroupsModel: this.options.securityGroupsModel}, function() {
    		that.enableDisableDeleteButton(); 
        	that.delegateEvents(that.events);
    	});   		
        
    },
    
    render: function () {
    	this.undelegateEvents();
        
    	if ($('.messages').html() != null) {
        	$('.messages').remove();
        }
        if ($("#security_groups").html() != null) {
            var new_template = this._template({securityGroupsModel: this.options.securityGroupsModel});
            var checkboxes = [];
            for (var index in this.options.securityGroupsModel.models) { 
                var secGroupsId = this.options.securityGroupsModel.models[index].id;
                if ($("#checkbox_sec_groups_"+secGroupsId).is(':checked')) {
                    checkboxes.push(secGroupsId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var secGroupsId = checkboxes[index];
                var check = $("#checkbox_sec_groups_"+secGroupsId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }    
           this.enableDisableDeleteButton();      
        }
        this.delegateEvents(this.events);
 		 
        return this;
    }
});