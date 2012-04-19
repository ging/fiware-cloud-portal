var UpdateInstanceView = Backbone.View.extend({
    
    _template: _.template($('#updateInstanceFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'update',
      'click .modal-backdrop': 'close'   
    },
    
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },
    
    render: function () {
        console.log("Rendering update instance");
        if ($('#update_instance').html() != null) {
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
        $('#update_instance').remove();
        $('.modal-backdrop').remove();
    },
    
    update: function(e) {
        console.log("Starting update");
        this.model.set({"name": this.$('input[name=name]').val()});
        console.log($('input[name=name]').val());
        this.model.save();
        this.close();
    }
    
});