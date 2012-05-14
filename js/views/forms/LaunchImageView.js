var LaunchImageView = Backbone.View.extend({
    
    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #launchBtn': 'launch'   
    },
    
    initialize: function() {
        this.options.flavors.bind("reset", this.render, this);
        this.options.flavors.fetch();
        this.options.keypairs.fetch();
    },
    
    render: function () {
        var flavors = this.options.flavors;
        console.log($('#launch_image').html() != null);
        if ($('#launch_image').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model.models, flavors: flavors, keypairs: this.options.keypairs}));
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        this.model.unbind("reset", this.render, this);
        console.log("Closing launch instance");
        $('#launch_image').remove();
        $('.modal-backdrop').remove();
    },
    
    launch: function(e) {
        var instance = new Instance();
        
        console.log("Starting launch");
        
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
        this.close();
    }
    
});