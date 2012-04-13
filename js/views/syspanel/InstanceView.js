var InstanceView = Backbone.View.extend({
    
    _template: _.template($('#instancesTemplate').html()),
    
    initialize: function() {
        this.model.bind("reset", this.rerender, this);
        this.model.fetch();
    },
    
    events:{
   		'change .checkbox':'enableDisableTerminateButton',
   		'click #instances_terminate':'displayTerminatePage',
  	},
  	
  	enableDisableTerminateButton: function (e) {
  		console.log("enableDisableTerminateButton called");
  		for (var index = 0; index < this.model.length; index++) { 
			var instanceId = this.model.models[index].get('id');	 
			if($("#checkbox_"+instanceId).is(':checked'))
				{
   		   	   			$("#instances_terminate").attr("disabled", false);
						return;				}
		}
		$("#instances_terminate").attr("disabled", true);
			
    },
    
    displayTerminatePage: function (e) {
  		console.log("displayTerminatePage called");
  		$('.modal_hide_in ').show();
  		console.log($('.modal_hide_in ').css('display') );
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
       
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    }
});