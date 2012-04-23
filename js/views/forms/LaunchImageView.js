var LaunchImageView = Backbone.View.extend({
    
    _template: _.template($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'launch'   
    },
    
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },
    
    render: function () {
        console.log("Rendering launch image");
        if ($('#launch_image').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        //$('.modal span.help-block').hide();
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        console.log("Closing update instance");
        $('#launch_image').remove();
        $('.modal-backdrop').remove();
    },
    
    launch: function(e) {
        console.log("Starting launch");
        this.model.set({"name": this.$('input[name=name]').val()});
        console.log($('input[name=name]').val());
        this.model.save();
        this.close();
    }
    
});