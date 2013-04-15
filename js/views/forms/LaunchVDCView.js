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
        var name = $('input[name=vdc_name]').val();
        var vdc_description = $('input[name=vdc_description]').val();
        var network_name = $('input[name=network_name]').val();
        var network_description = $('input[name=network_description]').val();
        var bandwidth = $('input[name=bandwidth]').val();
        var size = $('input[name=size]').val();
        var storage = $('input[name=storage]').val();
        var vcpus = $('input[name=vcpus]').val();
        var memory = $('input[name=memory]').val();

        vdc.set("name", name);
        vdc.set("vdc_description", vdc_description);
        vdc.set("network_name", network_name);
        vdc.set("network_description", network_description);
        vdc.set("bandwidth", bandwidth);
        vdc.set("size", size);
        vdc.set("storage", storage);
        vdc.set("vcpus", vcpus);
        vdc.set("memory", memory);

        vdc.save();
        var subview = new MessagesView({state: "Success", title: "Virtual Data Center "+vdc.get("name")+" launched."});
        subview.render();
        this.close();
    }

});