var CreateSecurityGroupView = Backbone.View.extend({
    
    _template: _.itemplate($('#createSecurityGroupFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #createBtn': 'createSecurityGroup',
      'click .modal-backdrop': 'close',  
      'click #name': 'showTooltipName',       
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
    
    createSecurityGroup: function(e) {
    	e.preventDefault();
    	self = this;
    	var namePattern = /^[a-z0-9_-]{1,87}$/;
        var name = $('input[name=name]').val();
        var description = $('input[name=description]').val();
		var nameOK, descriptionOK;
		
        namePattern.test(name) ? nameOK = true : nameOK = false;
  		
  		(description !== "" && description !== undefined) ? descriptionOK = true : descriptionOK = false;	
  			
		console.log(nameOK);
		console.log(descriptionOK);
		
  		if (nameOK && descriptionOK) {  			
  			for (var index in self.options.securityGroupsModel.models) {
  				if (self.options.securityGroupsModel.models[index].attributes.name === name) {
  					var subview = new MessagesView({el: '#content', state: "Error", title: "Security Group "+name+" already exists. Please try again."});     
            		subview.render(); 
            		return; 						
  				}
  			}
  			var newSecurityGroup = new SecurityGroup();        
		    newSecurityGroup.set({'name': name, 'description': description});
		    newSecurityGroup.save();
		    var subview = new MessagesView({el: '#content', state: "Success", title: "Security group "+name+" created."});     
		    subview.render();  	  			
  		} else {
  			var subview = new MessagesView({el: '#content', state: "Error", title: "Wrong values for Security Group. Please try again."});     
           	subview.render();	  			
  		}           
        self.close();
    }
    
});