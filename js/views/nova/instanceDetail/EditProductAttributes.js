var EditProductAttributesView = Backbone.View.extend({

    _template: _.itemplate($('#editProductAttributesTemplate').html()),

    events: {
      'click #closeModal': 'close',
      'click #cancel': 'close',
      'click .clickOut': 'close'
    },

    initialize: function() {
        var self = this;
    },

    render: function () {
        console.log(this.options);
        $(this.el).append(this._template({productAttributes: this.options.productAttributes}));
        $('.modal:last').modal();
        $('.modal-backdrop').addClass("clickOut");
        return this;
    },

    autoRender: function () {

        $(this.el).find("#edit_product_attributes").remove();
        $(this.el).append(self._template({productAttributes: this.options.attributes}));
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_product_attributes').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    }

});