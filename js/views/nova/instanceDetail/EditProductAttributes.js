var EditProductAttributesView = Backbone.View.extend({

    _template: _.itemplate($('#editProductAttributesTemplate').html()),

    events: {
      'click #closeModal': 'close',
      'click #cancel': 'close',
      'click .clickOut': 'close',
      'click #accept': 'editAttributes'
    },

    initialize: function() {
        var self = this;
    },

    render: function () {
        $(this.el).append(this._template({model: this.model, productAttributes: this.options.productAttributes}));
        $('.modal:last').modal();
        $('.modal-backdrop').addClass("clickOut");
        return this;
    },

    autoRender: function () {

        $(this.el).find("#edit_product_attributes").remove();
        $(this.el).append(self._template({model: this.model, productAttributes: this.options.attributes}));
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_product_attributes').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    editAttributes: function (e) {

        if (this.options.productAttributes === undefined) {
            return;
        }

        var newAttributes = this.options.productAttributes;

        for (var i in newAttributes) {
            newAttributes[i].value = $('input[name=attr_' + i + ']').val();
        }

        this.model.save(undefined, {success: function (model, resp) {
            console.log('Succ ', resp);
        }, error: function (model, e) {
            console.log('Error attr ', e);
        }});
    }

});