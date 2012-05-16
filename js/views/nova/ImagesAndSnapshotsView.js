var ImagesAndSnapshotsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaImagesAndSnapshotsTemplate').html()),
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'change .checkbox':'enableDisableTerminateButton',
        'click #images_delete':'onDelete',
        'click .editBtn' : 'onEdit',
        'click .launchBtn' : 'onLaunch'
    },
    
    enableDisableTerminateButton: function () {
        if ($(".checkbox:checked").size() > 0) { 
            $("#images_delete").attr("disabled", false);
        } else {
            $("#images_delete").attr("disabled", true);
        }
        
    },
    
    onDelete: function() {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Images", btn_message: "Delete Images", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var instance = $(this).val(); 
                    console.log("Image to delete: " + instance);
                    var inst = self.model.get(instance);
                    inst.destroy();
            });
        }});
        subview.render();
    },
    
    onLaunch: function(evt) {
        console.log(this.options.flavors);
        var image = this.model.get(evt.target.value);
        var subview = new LaunchImageView({model: image, el: 'body', flavors: this.options.flavors, keypairs: this.options.keypairs});
        subview.render();
    },
    
    onEdit: function(evt) {
        var image = this.model.get(evt.target.value);
        var subview = new UpdateImageView({model: image, el: 'body'});
        subview.render();
    },
    
    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
    },
    
    render: function () {
        if ($("#images").html() != null) {
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
        this.enableDisableTerminateButton();
        return this;
    }
    
    
});