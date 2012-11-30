var NovaKeypairsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaKeypairsTemplate').html()),
    
    initialize: function() {
    	
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);      
        
       	//this.model.fetch();
       	//this.options.securityGroupsModel.fetch();
       	this.renderFirst();
    },
    
    events: {
        "click .delete_keypair": "onDeleteKeyPair",
        'click #delete_sec_group': 'onDeleteSecGroup',
      	'click #delete_sec': 'onDeleteSec',
    },
    
    onDeleteKeyPair: function (e) {
        var keypair =  this.model.get(e.target.value);
        //TODO Remove Keypair
    },
    
     onDeleteSec: function (e) {
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
    
     onDeleteSecGroup: function (e) {
     	console.log("delete sec group");
        var keypair =  this.model.get(e.target.value);
    },

    enableDisableDeleteButton: function () {
        if ($(".checkbox_keypairs_:checked").size() > 0) { 
            $("#keypairs_delete").attr("disabled", false);
        } else {
            $("#keypairs_delete").attr("disabled", true);
        } 
        
    },

    renderFirst: function () {
    	UTILS.Render.animateRender(this.el, this._template, {models: this.model.models});   		
         this.enableDisableDeleteButton();
    },
    
    render: function () {
    	if ($('.messages').html() != null) {
        	$('.messages').remove();
        }        
        if ($("#keypairs").html() != null) {
            var new_template = this._template({models: this.model.models});
            var checkboxes = [];
            for (var index in this.model.models) { 
                var keypairsId = this.model.models[index].id;
                console.log("keypairsId");
                console.log(keypairsId);
                if ($("#checkbox_keypairs_"+keypairsId).is(':checked')) {
                    checkboxes.push(keypairsId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var keypairsId = checkboxes[index];
                var check = $("#checkbox_keypairs_"+keypairsId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }    
            this.enableDisableDeleteButton();       
        } 
                
        return this;
    }
});