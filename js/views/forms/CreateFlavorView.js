var CreateFlavorView = Backbone.View.extend({

    _template: _.itemplate($('#createFlavorFormTemplate').html()),

    events: {
        'submit #form': 'onSubmit',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'input input': 'onInput',
        'click .modal-backdrop': 'close'
    },

    initialize: function() {
        this.model.bind("change", this.render, this);
    },

    close: function(e) {
        this.model.unbind("change", this.render, this);
        $('#create_flavor').remove();
        $('.modal-backdrop').remove();
        console.log("closing flavor create");
        this.onClose();
    },

    onClose: function() {
        console.log("closing flavor create");
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

    onInput: function () {
        var message = '';
        var newFlavor = new Flavor();
        newFlavor.set({'flavor_id': this.$('input[name=flavor_id]').val()});
        newFlavor.set({'name': this.$('input[name=name]').val()});
        newFlavor.set({'vcpus': parseInt(this.$('input[name=vcpus]').val(), 0)});
        newFlavor.set({'ram': parseInt(this.$('input[name=memory_mb]').val(), 0)});
        newFlavor.set({'disk': parseInt(this.$('input[name=disk_gb]').val(), 0)});
        if (this.$('input[name=eph_gb]').val() !== "") {
            newFlavor.set({'ephemeral': parseInt(this.$('input[name=eph_gb]').val(), 0)});
        }

        // Check if there is a similar existing flavor.
        for (var idx in this.options.flavors.models) {
            if (this.options.flavors.models.hasOwnProperty(idx)) {
                var flav = this.options.flavors.models[idx];
                if (flav.get('vcpus') === newFlavor.get('vcpus') &&
                    flav.get('ram') === newFlavor.get('ram') &&
                    flav.get('disk') === newFlavor.get('disk') &&
                    flav.get('ephemeral') === newFlavor.get('ephemeral')
                    ) {
                    message = 'This flavor already exists.';
                }
            }
        }
        console.log(message);
        this.$('input[name=vcpus]')[0].setCustomValidity(message);
        this.$('input[name=memory_mb]')[0].setCustomValidity(message);
        this.$('input[name=disk_gb]')[0].setCustomValidity(message);
        this.$('input[name=eph_gb]')[0].setCustomValidity(message);
    },

    onSubmit: function(e){
        e.preventDefault();
        var subview;
        //Check if the fields are not empty, and the numbers are not negative nor decimal

        if ( (this.$('input[name=flavor_id]').val()==="") ||
             (this.$('input[name=flavor_id]').val()%1!==0) ||
             (this.$('input[name=flavor_id]').val()<=0) ||

             (this.$('input[name=name]').val()==="") ||

             (this.$('input[name=vcpus]').val()==="") ||
             (this.$('input[name=vcpus]').val()%1!==0) ||
             (this.$('input[name=vcpus]').val()<=0) ||

             (this.$('input[name=memory_mb]').val()==="") ||
             (this.$('input[name=memory_mb]').val()<=0) ||
             (this.$('input[name=memory_mb]').val()%1!==0) ||

             (this.$('input[name=disk_gb]').val()==="") ||
             (this.$('input[name=disk_gb]').val()<0) ||

             (this.$('input[name=eph_gb]').val()==="") ||
             (this.$('input[name=eph_gb]').val()%1!==0) ||
             (this.$('input[name=eph_gb]').val()<0)

             ) {

                console.log($('input[name=flavor_id]').val());
                console.log($('input[name=name]').val());
                console.log($('input[name=vcpus]').val());
                console.log($('input[name=memory_mb]').val());
                console.log($('input[name=disk_gb]').val());
                console.log($('input[name=eph_gb]').val());

              subview = new MessagesView({state: "Error", title: "Wrong input values for flavor. Please try again."});
              subview.render();
        } else {
            var newFlavor = new Flavor();
            newFlavor.set({'flavor_id': this.$('input[name=flavor_id]').val()});
            newFlavor.set({'name': this.$('input[name=name]').val()});
            newFlavor.set({'vcpus': parseInt(this.$('input[name=vcpus]').val(), 0)});
            newFlavor.set({'ram': parseInt(this.$('input[name=memory_mb]').val(), 0)});
            newFlavor.set({'disk': parseInt(this.$('input[name=disk_gb]').val(), 0)});
            if (this.$('input[name=eph_gb]').val() !== "") {
                newFlavor.set({'ephemeral': parseInt(this.$('input[name=eph_gb]').val(), 0)});
            }

            // Check if there is a similar existing flavor.
            for (var idx in this.options.flavors.models) {
                if (this.options.flavors.models.hasOwnProperty(idx)) {
                    var flav = this.options.flavors.models[idx];
                    if (flav.get('vcpus') === newFlavor.get('vcpus') &&
                        flav.get('ram') === newFlavor.get('ram') &&
                        flav.get('disk') === newFlavor.get('disk') &&
                        flav.get('ephemeral') === newFlavor.get('ephemeral')
                        ) {
                        subview = new MessagesView({state: "Error", title: "This flavor already exists. Please try again."});
                        subview.render();
                    }
                }
            }

            newFlavor.save(UTILS.Messages.getCallbacks("Flavor "+newFlavor.get("name") + " created.", "Error creating flavor "+newFlavor.get("name"), {context: this}));
        }
    }

});