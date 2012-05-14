var CreateFlavorView = Backbone.View.extend({
    
    _template: _.itemplate($('#createKeyPairFormTemplate').html()),
    
    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
    },

    render: function () {
        console.log("Rendering create flavor");
        if ($('#create_keypair').html() != null) {
            //return;
            $('#create_keypair').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },
    
    onSubmit: function(e){
        console.log("onSubmit called");
        e.preventDefault();
        
        /*$("#create_flavor_form").validate({ 
            rules: { 
              tenant_id: "required",
              name: { 
              required: true 
              }, 
              vcpus: {
                required: true
              },
              memory_mb: {
                required: true
              },
              disk_gb: {
                required: true
              },     
              eph_gb: {
                required: true
              },            
            messages: { 
              tenant_id: "This field is required.",
              name: "This field is required.", 
              vcpus: "This field is required.",
              memory_mb: "This field is required.",
              disk_gb: "This field is required.",
              eph_gb: "This field is required."
            } 
           }
      });  */
     
     //Check if the fields are not empty, and the numbers are not negative nor decimal

        $('#create_keypair').remove();
        $('.modal-backdrop').remove();

    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_keypair').remove();
        $('.modal-backdrop').remove();
    },
   
});