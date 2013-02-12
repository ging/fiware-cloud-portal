var ObjectStorageContainersView = Backbone.View.extend({

    _template: _.itemplate($('#objectstorageContainersTemplate').html()),

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events: {
        'change .checkbox_containers':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
        'click #containers__action_create': 'onCreateContainer',
        'click .btn-upload': 'onUploadObject',
        'click .btn-delete':'onDelete',
        'click .btn-delete-group': 'onDeleteGroup'
    },

    onCreateContainer: function(evt) {
        var subview = new CreateContainerView({el: 'body', model:this.model});
        subview.render();
    },
    
    onUploadObject: function(evt) {  
        var self = this;
        var cont = self.model.get(evt.target.value);
        var subview = new UploadObjectView({el: 'body',  model: cont});
        subview.render();
    },  
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    onDelete: function(evt) {
        var container = evt.target.value;
        var self = this;     
        var cont;         
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Container", btn_message: "Delete Container", onAccept: function() {
            cont = self.model.get(container);
                if (cont.get("count")>0) {
                    console.log(cont);
                    var subview2 = new MessagesView({el: '#content', state: "Error", title: "Unable to delete non-empty container "+cont.get("id")});     
                    subview2.render();
                    return; 
                } else {
                cont.destroy();
      
                var subview3 = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("id")+" deleted."});  
                subview3.render();   
                }
        }});        
        subview.render();
    },

    onDeleteGroup: function(evt) {
        var self = this;
        var cont;
        var subview = new ConfirmView({el: 'body', title: "Delete Containers", btn_message: "Delete Containers", onAccept: function() {
            $(".checkbox_containers:checked").each(function () {
                    var container = $(this).val();
                    
                    cont = self.model.get(container);                    
                    if (cont.get("count")>0) {
                        var subview2 = new MessagesView({el: '#content', state: "Conflict", title: "Container "+cont.get("id")+" contains objects."});     
                        subview2.render();
                        return; 
                    } else {        
                    cont.destroy();    
                    var subview3 = new MessagesView({el: '#content', state: "Success", title: "Container "+cont.get("name")+" deleted."});     
                    subview3.render();
                   }
            });
        }});
        subview.render();
    },
    
    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_containers").attr('checked','checked');
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_containers").attr('checked',false);
            this.enableDisableDeleteButton();
        }
        
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_containers:checked").size() > 0) { 
            $("#containers_terminate").attr("disabled", false);
        } else {
            $("#containers_terminate").attr("disabled", true);
        }

    },
    
    renderFirst: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
        this.enableDisableDeleteButton();
    },
    
    render: function () {
        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#containers").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var index, containerId, check;
            for (index in this.model.models) { 
                containerId = this.model.models[index].id;
                if ($("#checkbox_"+containerId).is(':checked')) {
                    checkboxes.push(containerId);
                }
            }
            $(this.el).html(new_template);
            for (index in checkboxes) { 
                containerId = checkboxes[index];
                check = $("#checkbox_"+containerId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }    
            this.enableDisableDeleteButton();       
        }
        
        return this;
    }
});