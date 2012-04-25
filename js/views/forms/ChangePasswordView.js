var ChangePasswordView = Backbone.View.extend({
    
    _template: _.template($('#changePasswordFormTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click #updateBtn': 'update',
      'click .modal-backdrop': 'close'   
    },
    
    initialize: function() {
    },
    
    render: function () {
        console.log("Rendering change password");
        if ($('#change_password').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model}));
        //$('.modal span.help-block').hide();
        $('.modal:last').modal();
        return this;
    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        console.log("Closing change password");
        $('#change_password').remove();
        $('.modal-backdrop').remove();
    },
    
    update: function(e) {
        console.log("Starting update password");
        var password = $('input[name=instance_password]').val();
        this.model.changepassword(password); 
        this.close();
    }
    
});