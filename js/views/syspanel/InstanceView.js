var InstanceView = Backbone.View.extend({
    
    _template: _.template($('#instancesTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.model.fetch();
    },
    
    events:{
   		'change .checkbox_instance':'enableDisableTerminateButton',
   		'click #terminate_instances': 'checkIfDisabled'
  	},
  	
  	checkIfDisabled: function (e) {
  		for (var index = 0; index < this.model.length; index++) { 
			var instanceId = this.model.models[index].get('id');	 
			if($("#checkbox_"+instanceId).is(':checked'))
				{
					$("#terminate_instances").attr("href", "#syspanel/instances/terminate");
				}
		}	console.log("Button disabled");		
    },
    
  	enableDisableTerminateButton: function (e) {
  		console.log("enableDisableTerminateButton called");
  		for (var index = 0; index < this.model.length; index++) { 
			var instanceId = this.model.models[index].get('id');	 
			if($("#checkbox_"+instanceId).is(':checked'))
				{
   		   	   			$("#terminate_instances").attr("disabled", false);
						return;				}
		}
		$("#terminate_instances").attr("disabled", true);
    },
   
    
    render: function () {
        if ($("#instances").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        } else {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var instanceId = this.model.models[index].id;
                if ($("#checkbox_"+instanceId).is(':checked')) {
                    checkboxes.push(instanceId);
                }
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var instanceId = checkboxes[index];
                var check = $("#checkbox_"+instanceId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var instanceId = dropdowns[index];
                var drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }           
        }
        this.enableDisableTerminateButton();
        return this;
    },
});