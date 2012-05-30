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
        $('#create_keypair').remove();
        $('.modal-backdrop').remove();

    },
    
    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_keypair').remove();
        $('.modal-backdrop').remove();
    },
   
});