var NovaVolumeSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVolumeSnapshotsTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox':'enableDisableDeleteButton',
        'click .btn-delete':'onDelete',
        'click .btn-delete-group':'onDeleteGroup',
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox:checked").size() > 0) { 
            $("#volume_snapshots_delete").attr("disabled", false);
        } else {
            $("#volume_snapshots_delete").attr("disabled", true);
        }        
    },
    
   	onDelete: function(evt) {
     	var self = this;
        var volumeSnapshot = $(this).val(); 
        var volSnapshot = self.model.get(volumeSnapshot);
        var subview = new ConfirmView({el: 'body', title: "Delete Volume Snapshot", btn_message: "Delete Volume Snapshot", onAccept: function() {
            volSnapshot.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume snapshot "+inst.get("name")+" deleted."});     
            subview.render();
        }});        
        subview.render();
    },
    
    onDeleteGroup: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume Snapshot", btn_message: "Delete Images", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var volumeSnapshot = $(this).val(); 
                    var volSnapshot = self.model.get(volumeSnapshot);
                    volSnapshot.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume snapshot "+inst.get("name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
    
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
    },
    
    render: function () {
        if ($("#volume_snapshots").html() != null) {
            var new_template = this._template(this.model);
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