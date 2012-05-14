var ConfirmView = Backbone.View.extend({
    
    _template: _.itemplate($('#confirmTemplate').html()),
    
    events: {
        'click #confirm_btn': 'onAccept',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },
    
    initialize: function() {
        this.options.title = this.options.title || "Are you sure?"
        this.options.btn_message = this.options.btn_message || "Confirm";
    },
    
    render: function () {
        console.log("Rendering confirm form");
        if ($('#confirm').html() != null) {
            $('#confirm').remove();
            $('.modal-backdrop').remove();
        }
        console.log(this);
        $(this.el).append(this._template({title:this.options.title, btn_message: this.options.btn_message}));
        $('.modal:last').modal();
        return this;
    },
    
    onAccept: function(e){
        console.log("Accepted"); 
        this.options.onAccept();
    },  
    
    close: function(e) {
        this.undelegateEvents();
        $('#confirm').remove();
        $('.modal-backdrop').remove();
    },
   
});