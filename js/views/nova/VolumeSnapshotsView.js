var NovaVolumeSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVolumeSnapshotsTemplate').html()),
    
    dropdownId: undefined,
    
    events:{
        'change .checkbox':'enableDisableDeleteButton',
        'click .btn-delete-volume':'onDelete',
        'click .btn-delete-group':'onDeleteGroup'
    },
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
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
        //var volumeSnapshot = $(this).val(); 
        var volumeSnapshot = this.model.get(evt.target.value);
        var volSnapshot = self.model.get(volumeSnapshot);
        var subview = new ConfirmView({el: 'body', title: "Delete Volume Snapshot", btn_message: "Delete Volume Snapshot", onAccept: function() {
            volSnapshot.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Volume snapshot "+volSnapshot.get("display_name")+" deleted."});     
            subview.render();
        }});        
        subview.render();
    },
    
    onDeleteGroup: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume Snapshots", btn_message: "Delete Images", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var volumeSnapshot = $(this).val(); 
                    var volSnapshot = self.model.get(volumeSnapshot);
                    volSnapshot.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Volume snapshot "+volSnapshot.get("display_name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
    
    renderFirst: function() {
    	this.undelegateEvents();
        this.delegateEvents(this.events);
        $(this.el).html(this._template({models:this.model.models, instancesModel:this.options.instancesModel, volumesModel:this.options.volumesModel, flavors:this.options.flavors}));
        //UTILS.Render.animateRender(this.el, this._template, this.model);
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },
    
    render: function () {
    	this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($("#volume_snapshots").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var volSnapshot = this.model.models[index].id;
                if ($("#checkbox_"+volSnapshot).is(':checked')) {
                    checkboxes.push(volSnapshot);
                }
                if ($("#dropdown_"+volSnapshot).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var volSnapshot = checkboxes[index];
                var check = $("#checkbox_"+volSnapshot);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var volSnapshot = dropdowns[index];
                var drop = $("#dropdown_"+volSnapshot);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            
        }
        this.enableDisableDeleteButton();
        return this;
    }
    
    
});