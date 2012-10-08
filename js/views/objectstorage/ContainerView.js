var ObjectStorageContainerView = Backbone.View.extend({
    
    _template: _.itemplate($('#objectstorageContainerTemplate').html()),
    
    initialize: function() {
        this.model.bind("change", this.onContainerDetail, this);
        this.model.fetch();
    },
    
    onContainerDetail: function() {
        this.render();
    },

    events: {
        'change .checkbox_objects': 'enableDisableTerminateButton',
        'click #objects__action_upload': 'onUploadObject',
        'click .btn-delete':'onDelete',
        'click #objects_delete': 'onDeleteGroup'
    },
    
    onUploadObject: function(evt) {
        var subview = new UploadObjectView({el: 'body', model: this.model});
        subview.render();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    onDelete: function(evt) {
        var self = this;
        var object = evt.target.value;
        var obj= this.model.get('objects')[object];
        var subview = new ConfirmView({el: 'body', title: "Confirm Delete Object", btn_message: "Delete Object", onAccept: function() {
            self.model.removeObjects([obj]);
            var subview = new MessagesView({el: '#content', state: "Success", title: "Object "+obj.name+" deleted."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Objects", btn_message: "Delete Objects", onAccept: function() {
            var objs = [];
            $(".checkbox:checked").each(function () {
                    var object = $(this).val(); 
                    var obj = self.model.get('objects')[object];
                    objs.push(obj);
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Object "+obj.name+" deleted."});     
                    subview.render();
            });
            self.model.removeObjects(objs);
        }});
        subview.render();
    },
    
    enableDisableTerminateButton: function () {
        if ($(".checkbox_objects:checked").size() > 0) { 
            $("#objects_delete").attr("disabled", false);
        } else {
            $("#objects_delete").attr("disabled", true);
        }
        
    },
    
    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template, {model:this.model});
    },
});