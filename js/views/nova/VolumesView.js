var NovaVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    events: {
        'change .checkbox_volumes':'enableDisableDeleteButton',
        'click .btn-create-volume':'onCreate',
        'click .btn-edit-volumes':'onEdit',
        'click .btn-delete-volume':'onDelete',
        'click .btn-camera':'onSnapshot',
        'click .btn-delete-group':'onDeleteGroup'
    },
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.render();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("reset");
    },
    
    onCreate: function(evt) {
        var subview = new CreateVolumeView({el: 'body'});
        subview.render();
    },
    
    onSnapshot: function(evt) {
        var volumeSnapshot = evt.target.value;
        var volumeSnap = this.model.get(volumeSnapshot);
        var subview = new CreateVolumeSnapshotView({el: 'body', model: volumeSnap});
        subview.render();
    },
    
    onEdit: function(evt) {
        var vol = evt.target.getAttribute("value");
        var volume = this.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instances});
        subview.render();
    },
    
    onDelete: function(evt) {
        var volume = evt.target.value;
        var vol = this.model.get(volume);
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volume", onAccept: function() {
            vol.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volumes", onAccept: function() {
            $(".checkbox_volumes:checked").each(function () {
                    var volume = $(this).val(); 
                    var vol = self.model.get(volume);
                    vol.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});     
                    subview.render();
            });
        }});
        subview.render();
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_volumes:checked").size() > 0) { 
            $("#volumes_delete").attr("disabled", false);
        } else {
            $("#volumes_delete").attr("disabled", true);
        }
        
    },
    
    render: function() {
        if ($("#volumes").html() == null) {
            this.renderFirst();
        } else {
            this.renderSecond();
        }
    },
    
    renderFirst: function() {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models, volumeSnapshotsModel:this.options.volumeSnapshotModel, instances: this.options.instancesModel});
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },
        
    renderSecond: function () {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
            var new_template = this._template({models:this.model.models, volumeSnapshotsModel: this.options.volumeSnapshotModel, flavors:this.options.flavors});
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
        this.enableDisableDeleteButton();
        return this;
    }
    
});