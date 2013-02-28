var UserView = Backbone.View.extend({
    
    _template: _.itemplate($('#usersTemplate').html()),
    
    initialize: function() {
    },
    
    events: {
        'click .btn-create': 'onCreate',
        'click .btn-edit' : 'onUpdate',
        'click .btn-delete':'onDelete',
        'click .btn-disable':'onDisable',
        'click .btn-delete-group': 'onDeleteGroup',
        'change .checkbox_users':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
    },
    
    onCreate: function() {
    	var subview = new CreateUserView({el: 'body', model:this.model});
        subview.render();    	
    },
    
    onUpdate: function() {
    	var subview = new EditUserView({el: 'body', model:this.model});
        subview.render();   
    },
    
    onDisable: function() {
    },
    
    onDelete: function(evt) {
        var container = evt.target.value;
        var self = this;            
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete User", btn_message: "Delete User", onAccept: function() {
            cont = self.model.get(container);
                var subview = new MessagesView({el: '#content', state: "Success", title: "User deleted."});  
                subview3.render();   
                
        }});        
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Delete Projects", btn_message: "Delete Projects", onAccept: function() {
            $(".checkbox_containers:checked").each(function () {
                    var subview3 = new MessagesView({el: '#content', state: "Success", title: "Project deleted."});     
                    subview.render();
                   
            });
        }});
        subview.render();
    },
    
    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_users").attr('checked','checked');
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_users").attr('checked',false);
            this.enableDisableDeleteButton();
        }
        
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_users:checked").size() > 0) { 
            $("#users_delete").attr("disabled", false);
        } else {
            $("#users_delete").attr("disabled", true);
        }

    },
    
    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
    rerender: function() {
        $(this.el).empty().html(this._template(this.model));
    } 
});