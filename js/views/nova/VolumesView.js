var NovaVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    events: {
        'click .btn-edit-attachments-actions' : 'onEditAttachments',
        'click .btn-create-snapshot-actions':'onCreateSnapshot',
        'click .btn-delete-volume-actions':'onDeleteGroup',
        'change .checkbox_volumes':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
        'click .btn-create-volume':'onCreate',
        'click .btn-edit-volumes':'onEdit',
        'click .btn-delete-volume':'onDelete',
        'click .btn-camera':'onCreateSnapshot',
        //'click .btn-delete-group':'onDeleteGroup'
    },

    onEditAttachments: function(evt) {
        var self = this;
        var vol = $(".checkbox:checked").val();
        var volume = self.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instancesModel});
        subview.render();
    },
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.render();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("reset", this.render, this);
    },
    
    onCreate: function(evt) {
        var subview = new CreateVolumeView({el: 'body'});
        subview.render();
    },
    
    onCreateSnapshot: function(evt) {
        var volumeSnapshot = evt.target.value;
        var volumeSnap = this.model.get(volumeSnapshot);
        var subview = new CreateVolumeSnapshotView({el: 'body', model: volumeSnap});
        subview.render();
    },
    
    onEdit: function(evt) {
        var vol = evt.target.getAttribute("value");
        var volume = this.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instancesModel});
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

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_volumes").attr('checked','checked');
            $(".btn-edit-attachments-actions").hide();
            $(".btn-create-snapshot-actions").hide();
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_volumes").attr('checked',false);
            $(".btn-edit-attachments-actions").show();
            $(".btn-create-snapshot-actions").show();
            this.enableDisableDeleteButton();
        }
        
    },
    
    enableDisableDeleteButton: function () {
        var vol, volume;
        vol = $(".checkbox_volumes:checked").val();
        volume = this.model.get(vol);        
        if ($(".checkbox_volumes:checked").size() > 0) { 
            $("#volumes_delete").attr("disabled", false); 
            $(".btn-edit-attachments-actions").attr("disabled", false);
            $(".btn-create-snapshot-actions").attr("disabled", false);
            $(".btn-delete-volume-actions").attr("disabled", false);  
      
            if (volume.get("status") != "in-use") {
                $(".btn-create-snapshot-actions").show();
            } else {
                $(".btn-create-snapshot-actions").hide();
                //$(".btn-create-snapshot-actions").attr("disabled", true); 
            }
            if ($(".checkbox_volumes:checked").size() > 1) {
                $(".btn-edit-attachments-actions").hide();
                $(".btn-create-snapshot-actions").hide();
            } else {
                $(".btn-edit-attachments-actions").show();
                $(".btn-create-snapshot-actions").show();
            }   
        } else {
            $("#volumes_delete").attr("disabled", true);
            $(".btn-edit-attachments-actions").attr("disabled", true);
            $(".btn-create-snapshot-actions").attr("disabled", true);
            $(".btn-delete-volume-actions").attr("disabled", true);
            $(".btn-edit-attachments-actions").show();
            $(".btn-create-snapshot-actions").show();
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
        if ($("#volumes").html() != null) {
            var new_template = this._template({models:this.model.models, volumeSnapshotsModel: this.options.volumeSnapshotModel, flavors:this.options.flavors});
            var checkboxes = [];
            var dropdowns = [];
            var volume, check, drop, drop_actions_selected;
            for (index in this.model.models) { 
                volume = this.model.models[index].id;
                if ($("#checkbox_"+volume).is(':checked')) {
                    checkboxes.push(volume);
                }
                if ($("#dropdown_"+volume).hasClass('open')) {
                    dropdowns.push(volume);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                } 
            }
            $(this.el).html(new_template);
            for (index in checkboxes) { 
                volume = checkboxes[index];
                check = $("#checkbox_"+volume);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }            
            for (index in dropdowns) { 
                volume = dropdowns[index];
                drop = $("#dropdown_"+volume);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            if (($("#dropdown_actions").html() !== null) && (drop_actions_selected)) {
                $("#dropdown_actions").addClass("open");
            }
            this.enableDisableDeleteButton();            
        }
        
        return this;
    }
    
});