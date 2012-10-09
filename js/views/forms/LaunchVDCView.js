var LaunchVDCView = Backbone.View.extend({
    
    _template: _.itemplate($('#launchVDCTemplate').html()),

    events: {
      'click #cancelBtn': 'close',
      'click #close': 'close',
      'click .modal-backdrop': 'close',
      'click .btn-accept': 'launch',
      'click #myTab a': 'show',
      'click .btn-next': 'showNext',
      'click .btn-prev': 'showPrevious'
    },
    
    initialize: function() {
    },
    
    showPrevious: function() {
        this.showTab($($('#myTab li[class=active]').prev("#myTab li").children()[0]));
    },
    
    showNext: function() {
        this.showTab($($('#myTab li[class=active]').next("#myTab li").children()[0]));
    },
    
    show: function(e) {
        e.preventDefault();
        
        this.showTab($(e.target));
        
    },
    
    showTab: function(element) {
        element.tab('show');
        if ($('#myTab li[class=active]').html() === $('#myTab li:last').html()) {
            $('.btn-next').hide();
        } else {
            $('.btn-next').show();
        }
        
        if ($('#myTab li[class=active]').html() === $('#myTab li:first').html()) {
            $('.btn-prev').hide();
        } else {
            $('.btn-prev').show();
        }
    },
    
    render: function () {
        if ($('#launch_vdc').html() != null) {
            return;
        }
        $(this.el).append(this._template({}));
        $('.btn-prev').hide();
        $('.modal:last').modal();
        return this;
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    close: function(e) {
        $('#launch_vdc').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },
    
    launch: function(e) {
        var vdc = new VDC();
        vdc.save();
        var subview = new MessagesView({el: '#content', state: "Success", title: "Virtual Data Center "+vdc.get("name")+" launched."});     
        subview.render();
        this.close();
    }
    
});