var FlavorView = Backbone.View.extend({
    
    _template: _.itemplate($('#flavorsTemplate').html()),

    
    initialize: function() {
    	this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events: {
        'change .checkbox_flavor':'enableDisableDeleteButton',
        'click #flavors_delete': 'checkIfDisabled'
    },
    
    checkIfDisabled: function (e) {
  		for (var index = 0; index < this.model.length; index++) { 
			var flavorId = this.model.models[index].get('id');	 
			if($("#checkbox_"+flavorId).is(':checked'))
				{
					$("#flavors_delete").attr("href", "#syspanel/flavors/delete");
				}
		}	console.log("Button disabled");		
    },
   
  	enableDisableDeleteButton: function (e) {
  		for (var index = 0; index < this.model.length; index++) { 
			var flavorId = this.model.models[index].get('id');	 
			if($("#checkbox_"+flavorId).is(':checked'))
				{
   		   	   			$("#flavors_delete").attr("disabled", false);
						return;
				}
		}
		$("#flavors_delete").attr("disabled", true);
			
    },
             
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.enableDisableDeleteButton();
    },
    
	render: function () {
        if ($("#flavors").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            for (var index in this.model.models) { 
                var flavorId = this.model.models[index].id;
                if ($("#checkbox_"+flavorId).is(':checked')) {
                    checkboxes.push(flavorId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var flavorId = checkboxes[index];
                var check = $("#checkbox_"+flavorId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }    
            this.enableDisableDeleteButton();       
        }
        
        return this;
    },

});