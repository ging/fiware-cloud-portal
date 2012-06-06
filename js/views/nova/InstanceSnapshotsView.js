var NovaInstanceSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaInstanceSnapshotsTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox':'enableDisableDeleteButton',
        'click .btn-delete-group' : 'onDeleteGroup',
        'click .btn-delete' : 'onDelete',
        'click .btn-edit' : 'onEdit',
        'click .btn-launch' : 'onLaunch'
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox:checked").size() > 0) { 
            $("#instance_snapshot_delete").attr("disabled", false);
        } else {
            $("#instance_snapshot_delete").attr("disabled", true);
        }        
    },
    
    onDelete: function(evt) {
     	var self = this;
        var instanceSnapshot = $(this).val(); 
        var instSnapshot = self.model.get(instanceSnapshot);
        var subview = new ConfirmView({el: 'body', title: "Delete Instance Snapshot", btn_message: "Delete Instance Snapshot", onAccept: function() {
            instSnapshot.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance snapshot "+inst.get("name")+" deleted."});     
            subview.render();
        }});        
        subview.render();
    },
    
    onDeleteGroup: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Instance Snapshots", btn_message: "Delete Instance Snapshots", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var instanceSnapshot = $(this).val(); 
        			var instSnapshot = self.model.get(instanceSnapshot);
                    instSnapshot.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance snapshot "+inst.get("name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
    
    onLaunch: function(evt) {
        var instanceSnapshot = this.model.get(evt.target.value);
        var subview = new LaunchInstanceSnapshotView({model: image, el: 'body', flavors: this.options.flavors, keypairs: this.options.keypairs});
        subview.render();
    },
    
    onEdit: function(evt) {
        var image = this.model.get(evt.target.value);
        var subview = new UpdateInstanceSnapshotView({model: image, el: 'body'});
        subview.render();
    },
    
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
    },
    
    render: function () {
        if ($("#instance_snapshots").html() != null) {
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