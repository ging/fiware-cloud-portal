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
    },

     releaseFloatingIPs: function (e) {
		console.log("delete sec");
       	var sec_group_id = e.target.value;
        console.log(this.options.securityGroupsModel);
        //var sec_group = this.options.securityGroupsModel.get("sec_group_id");
        //console.log(sec_group);
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group", btn_message: "Delete Security Group", onAccept: function() {
            //sec_group.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Security Group "+sec_group.name+" deleted."});     
        	subview.render();
        }});
        subview.render();
    
    },
    
     releaseFloatingIP: function (e) {
     	console.log("delete sec group");
        var keypair =  this.model.get(e.target.value);
    },

    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_floating_ips_:checked").size() > 0) { 
            $("#ips_delete").attr("disabled", false);
        } else {
            $("#ips_delete").attr("disabled", true);
        }  
    },

    renderFirst: function () {
    	UTILS.Render.animateRender(this.el, this._template, {floatingIPsModel: this.options.floatingIPsModel});   		
        this.enableDisableDeleteButton();
    },
    
    render: function () {
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
       
        return this;
    }
});