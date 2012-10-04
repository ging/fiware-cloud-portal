var NovaImagesAndInstanceSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaImagesAndInstanceSnapshotsTemplate').html()),
    
    dropdownId: undefined,
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox_images':'enableDisableDeleteButtonImages',
        'click .btn-delete-group-images':'onDeleteGroupImages',
        'click .btn-edit-images':'onEditImages',
        'click .btn-launch-images':'onLaunchImages',
        //instance snapshots
        'change .checkbox_instances':'enableDisableDeleteButtonInstances',
        'click .btn-delete-group-instances' : 'onDeleteGroupInstances',
        'click .btn-delete-instances' : 'onDeleteInstances',
        'click .btn-edit-instances' : 'onEditInstances',
        'click .btn-launch-instances' : 'onLaunchInstances'
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    // Images
    
    enableDisableDeleteButtonImages: function () {
        if ($(".checkbox_images:checked").size() > 0) { 
            $("#images_delete").attr("disabled", false);
        } else {
            $("#images_delete").attr("disabled", true);
        }        
    },
    
    onDeleteGroupImages: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Images", btn_message: "Delete Images", onAccept: function() {
            $(".checkbox_images:checked").each(function () {
                    var image = $(this).val(); 
                    console.log("Image = "+image);
                    var img = self.model.get(image);
                    img.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Images "+img.get("name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
    
    onLaunchImages: function(evt) {
        console.log("launch");
        var image = this.model.get(evt.target.value);
        var subview = new LaunchImageView({model: image, flavors: this.options.flavors, keypairs: this.options.keypairs, el: 'body'});
        subview.render();
    },
    
    onEditImages: function(evt) {
        var image = this.model.get(evt.target.value);
        var subview = new UpdateImageView({model: image, el: 'body'});
        subview.render();
    },
    
    // Instance snapshots
    
    enableDisableDeleteButtonInstances: function () {	
        if ($(".checkbox_instances:checked").size() > 0) { 
            $("#instance_delete").attr("disabled", false);
        } else {
            $("#instance_delete").attr("disabled", true);
        }        
    },
    
    onDeleteInstances: function(evt) {
     	var self = this;
        var instanceSnapshot = this.model.get(evt.target.value);
        var instSnapshot = self.model.get(instanceSnapshot);
        var subview = new ConfirmView({el: 'body', title: "Delete Instance Snapshot", btn_message: "Delete Instance Snapshot", onAccept: function() {
            instSnapshot.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance snapshot "+instSnapshot.get("name")+" deleted."});     
            subview.render();
        }});        
        subview.render();
    },
    
    onDeleteGroupInstances: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Instance Snapshots", btn_message: "Delete Instance Snapshots", onAccept: function() {
            $(".checkbox_instances:checked").each(function () {
                    var instanceSnapshot = $(this).val(); 
                    console.log('Instance snapshot = '+instanceSnapshot);
        			var instSnapshot = self.model.get(instanceSnapshot);
                   	instSnapshot.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance snapshot "+instSnapshot.get("name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
    
    onLaunchInstances: function(evt) {
        var instanceSnapshot = this.model.get(evt.target.value);
        var subview = new LaunchImageView({model: instanceSnapshot, flavors: this.options.flavors, keypairs: this.options.keypairs, el: 'body'});
        subview.render();
    },
    
    onEditInstances: function(evt) {
        var image = this.model.get(evt.target.value);
        var subview = new UpdateImageView({model: image, el: 'body'});
        subview.render();
    },
    
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },
    
    render: function () {
    	this.undelegateEvents();
        this.delegateEvents(this.events);
        
        if ($("#images").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes_images = [];
            var dropdowns_images = [];
            var checkboxes_instances = [];
            var dropdowns_instances = [];
            for (var index in this.model.models) { 
                var imageId = this.model.models[index].id;
                if ($("#checkbox_images_"+imageId).is(':checked')) {
                    checkboxes_images.push(imageId);
                }
                if ($("#dropdown_images_"+imageId).hasClass('open')) {
                    dropdowns_images.push(imageId);
                }
            }
            for (var index in this.model.models) { 
                var instanceId = this.model.models[index].id;
                if ($("#checkbox_instances_"+instanceId).is(':checked')) {
                    checkboxes_instances.push(instanceId);
                }
                if ($("#dropdown_instances_"+instanceId).hasClass('open')) {
                    dropdowns_instances.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes_images) { 
                var imageId = checkboxes_images[index];
                var check = $("#checkbox_images_"+imageId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns_images) { 
                var imageId = dropdowns_images[index];
                var drop = $("#dropdown_images_"+imageId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            for (var index in checkboxes_instances) { 
                var instanceId = checkboxes_instances[index];
                var check = $("#checkbox_instances_"+instanceId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns_instances) { 
                var instanceId = dropdowns_instances[index];
                var drop = $("#dropdown_instances_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
        }
        this.enableDisableDeleteButtonImages();
        this.enableDisableDeleteButtonInstances();
        return this;
    }
    
    
});