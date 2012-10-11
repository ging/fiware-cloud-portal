var LaunchImageView = Backbone.View.extend({
    
    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn-image': 'close',
      'click #close-image': 'close',
      'click .modal-backdrop': 'close',
      'click .btn-launch-image': 'launch'
    },
    
    initialize: function() {
        this.options.keypairs.fetch();
    },
    
    render: function () {
        var flavors = this.options.flavors;
        if ($('#launch_image').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model.models, flavors: flavors, keypairs: this.options.keypairs}));
        //$('#launch_image').modal();
        return this;
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    close: function(e) {
        e.preventDefault();
        console.log("Removing launch image");
        $('#launch_image').remove();
        //$('.modal-backdrop:last').remove();
        this.onClose();
        if (this.model.unbond !== undefined) {
            this.model.unbind("reset", this.render, this);
        }
    },
    
    launch: function(e) {
        var instance = new Instance();
        var name = $('input[name=name]').val();
        var imageReg = this.model.id;
        var flavorReg = undefined;
        $("#id_flavor option:selected").each(function () {
                var flavor = $(this).val(); 
                if (flavor != "") {
                    flavorReg = flavor;
                }
        });
        var key_name = undefined;
        $("#id_keypair option:selected").each(function () {
                var keypair = $(this).val(); 
                if (keypair != "") {
                    key_name = keypair;
                }
        });
        var user_data = $('textarea[name=user_data]').val();
        var security_groups = undefined;
        var min_count = $('input[name=count]').val();
        var max_count = $('input[name=count]').val();
        var availability_zone = undefined;
        
        instance.set({"name": name});
        instance.set({"imageReg": imageReg});
        instance.set({"flavorReg": flavorReg});
        instance.set({"key_name": key_name});
        instance.set({"user_data": user_data});
        instance.set({"security_groups": security_groups});
        instance.set({"min_count": min_count});
        instance.set({"max_count": max_count});
        instance.set({"availability_zone": availability_zone});
        instance.save();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Instance "+instance.get("name")+" launched."});     
        subview.render();
        this.close();
    }
    
});