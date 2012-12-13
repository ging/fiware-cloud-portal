var NovaFloatingIPsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaFloatingIPsTemplate').html()),
    
    initialize: function() {
        this.options.floatingIPsModel.unbind("reset");      
        this.options.floatingIPsModel.bind("reset", this.render, this);    
       	this.renderFirst();
    },
    
    events: {
        'click #release_floating_IPs': 'releaseFloatingIPs',
      	'click #release_floating_IP': 'releaseFloatingIP',
      	'click .btn-allocate': 'allocateIP' 
    },

     releaseFloatingIPs: function (e) {
        var subview = new ConfirmView({el: 'body', title: "Release Floating IP", btn_message: "Release Floating IPs", onAccept: function() {
            var subview = new MessagesView({el: '#content', state: "Success", title: "Floating IPs "+sec_group.name+" released."});     
        	subview.render();
        }});
        subview.render();
    
    },
    
     releaseFloatingIP: function (e) {
    },
    
    allocateIP: function(e) {
    	console.log("allocate IP");
    	var subview = new AllocateIPView({el: 'body',  model: this.model});
        subview.render();
    },

    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_floating_ips_:checked").size() > 0) { 
            $("#ips_delete").attr("disabled", false);
        } else {
            $("#ips_delete").attr("disabled", true);
        }  
    },

    renderFirst: function () {     
        this.undelegateEvents();
    	var that = this;
    	UTILS.Render.animateRender(this.el, this._template, {floatingIPsModel: this.options.floatingIPsModel}, function() {
    		that.enableDisableDeleteButton(); 
        	that.delegateEvents(that.events);
    	});   
    },
    
    render: function () {
    	this.undelegateEvents();
    	if ($('.messages').html() != null) {
        	$('.messages').remove();
        }
       if ($("#floating_ips").html() != null) {
            var new_template = this._template({floatingIPsModels: this.options.floatingIPsModel.models});
            var checkboxes = [];
            for (var index in this.options.floatingIPsModel.models) { 
                var floatingIpsId = this.options.floatingIPsModel.models[index].id;
                if ($("#checkbox_floating_ips_"+floatingIpsId).is(':checked')) {
                    checkboxes.push(floatingIpsId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var floatingIpsId = checkboxes[index];
                var check = $("#checkbox_floating_ips_"+floatingIpsId);
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