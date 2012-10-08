var ObjectStorageContainersView = Backbone.View.extend({
    
    _template: _.itemplate($('#objectstorageContainersTemplate').html()),
    
    initialize: function() {
        this.render();
    },
    
    events: {
        'change .checkbox_containers':'enableDisableTerminateButton',
        'click #containers__action_create': 'onCreateContainer',
        'click .btn-upload': 'onUploadObject',
        'click .btn-delete':'onDelete',
        'click .btn-delete-group': 'onDeleteGroup'
    },
    
    onCreateContainer: function(evt) {
        var subview = new CreateContainerView({el: 'body'});
        subview.render();
    },
    
    onUploadObject: function(evt) {
        var container = evt.target.value;
        var subview = new UploadObjectView({el: 'body', model: this.model.get(container)});
        subview.render();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    onDelete: function(evt) {
        var container = evt.target.value;
        var cont = this.model.get(container);
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Container", btn_message: "Delete Container", onAccept: function() {
            cont.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("name")+" deleted."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Containers", btn_message: "Delete Containers", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var container = $(this).val(); 
                    var cont = self.model.get(container);
                    cont.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("name")+" deleted."});     
                    subview.render();
            });
        }});
        subview.render();
    },
    
    enableDisableTerminateButton: function () {
        if ($(".checkbox_containers:checked").size() > 0) { 
            $("#containers_terminate").attr("disabled", false);
        } else {
            $("#containers_terminate").attr("disabled", true);
        }
        
    },
    
    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
    },
});