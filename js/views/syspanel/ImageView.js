var ImagesView = Backbone.View.extend({
    
    _template: _.itemplate($('#imagesTemplate').html()),
        
   	initialize: function() {
         this.model.unbind("reset");
         this.model.bind("reset", this.render, this);
         this.renderFirst();
    },
        
	events: {
        'change .checkbox':'enableDisableDeleteButton',
   		'click .btn-delete':'onDelete',
   		'click .btn-delete-group':'onDeleteGroup',
   		'click .btn-launch': 'onLaunch'
    },  
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    onLaunch: function(evt) {
        var image = evt.target.value;
        var img = this.model.get(image);
        var self = this;
        console.log('Showing Instance Creation');
        var subview = new LaunchImageView({el: 'body', images: this.options.images, flavors: this.options.flavors, keypairs: this.options.keypairs, model: img});
        subview.render();
    },
    
    onDelete: function(evt) {
        var image = evt.target.value;
        var img = this.model.get(image);
        var subview = new ConfirmView({el: 'body', title: "Delete Image", btn_message: "Delete Image", onAccept: function() {
            img.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Image "+img.get("name")+" deleted."});     
        	subview.render();
        }});
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Images", btn_message: "Delete Images", onAccept: function() {
            $(".checkbox:checked").each(function () {
                    var image = $(this).val(); 
                    var img = self.model.get(image);
                    img.destroy();
                    var subview = new MessagesView({el: '#content', state: "Success", title: "Images "+img.get("name")+" deleted."});     
        			subview.render();
            });
        }});
        subview.render();
    },
		
	enableDisableDeleteButton: function (e) {
  		if ($(".checkbox:checked").size() > 0) { 
            $("#images_delete").attr("disabled", false);
        } else {
            $("#images_delete").attr("disabled", true);
        }
			
    },
	
	renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.enableDisableDeleteButton();
    },
	
    render: function () {
        if ($("#images").html() != null) {
            var new_template = this._template(this.model);
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var imageId = this.model.models[index].id;
                if ($("#checkbox_"+imageId).is(':checked')) {
                    checkboxes.push(imageId);
                }
                if ($("#dropdown_"+imageId).hasClass('open')) {
                    dropdowns.push(imageId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var imageId = checkboxes[index];
                var check = $("#checkbox_"+imageId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var imageId = dropdowns[index];
                var drop = $("#dropdown_"+imageId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }           
            this.enableDisableDeleteButton();
        }
        return this;
    }
    
});