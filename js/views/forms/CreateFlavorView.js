var CreateFlavorView = Backbone.View.extend({

    _template: _.itemplate($('#createFlavorFormTemplate').html()),

    events: {
        'click #submit': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close'
    },

    initialize: function() {
        this.model.bind("change", this.render, this);
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_flavor').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {

        for (var index = 0; index < this.model.length; index++) {
        }
        if ($('#create_flavor').html() != null) {
            $('#create_flavor').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onSubmit: function(e){
        e.preventDefault();
        var subview;
        //Check if the fields are not empty, and the numbers are not negative nor decimal

        if ( (this.$('input[name=flavor_id]').val()==="") ||
             (this.$('input[name=name]').val()==="") ||
             (this.$('input[name=vcpus]').val()==="") ||
             (this.$('input[name=memory_mb]').val()==="") ||
             (this.$('input[name=disk_gb]').val()==="") ||
             (this.$('input[name=eph_gb]').val()==="") ||
             (this.$('input[name=flavor_id]').val()<=0) ||
             (this.$('input[name=vcpus]').val()<=0) ||
             (this.$('input[name=memory_mb]').val()<=0) ||
             (this.$('input[name=disk_gb]').val()<=0) ||
             (this.$('input[name=eph_gb]').val()<=0) ||
             (this.$('input[name=flavor_id]').val()%1!==0) ||
             (this.$('input[name=vcpus]').val()%1!==0) ||
             (this.$('input[name=memory_mb]').val()%1!==0) ||
             (this.$('input[name=disk_gb]').val()%1!==0) ||
             (this.$('input[name=eph_gb]').val()%1!==0) ) {

            console.log($('input[name=flavor_id]'));
            console.log($('input[name=name]'));
            console.log($('input[name=vcpus]'));
            console.log($('input[name=memory_mb]'));
            console.log($('input[name=disk_gb]'));
            console.log($('input[name=eph_gb]'));

              subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for flavor. Please try again."});
              subview.render();
        } else {
            var newFlavor = new Flavor();
            newFlavor.set({'flavor_id': this.$('input[name=flavor_id]').val()});
            newFlavor.set({'name': this.$('input[name=name]').val()});
            newFlavor.set({'vcpus': this.$('input[name=vcpus]').val()});
            newFlavor.set({'memory_mb': this.$('input[name=memory_mb]').val()});
            newFlavor.set({'disk_gb': this.$('input[name=disk_gb]').val()});
            newFlavor.set({'eph_gb': this.$('input[name=eph_gb]').val()});
            newFlavor.save();
            subview = new MessagesView({el: '#content', state: "Success", title: "Flavor "+newFlavor.get('name')+" created."});
            subview.render();
        }
        this.close();
    }

});