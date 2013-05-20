var LaunchImageView = Backbone.View.extend({

    _template: _.itemplate($('#launchImageTemplate').html()),

    events: {
      'click #cancelBtn-image': 'close',
      'click #close-image': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'launch'
    },

    initialize: function() {
        this.options.keypairs.fetch();
        this.options.flavors.fetch();
        this.options.secGroups.fetch();
    },

    render: function () {
        var flavors = this.options.flavors;
        if ($('#launch_image').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model.models, flavors: flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups}));
        $('#launch_image').modal();
        return this;
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    close: function(e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        console.log("Removing launch image");
        $('#launch_image').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    launch: function(e) {
        var self = this;

        var instance = new Instance();
        var name = $('input[name=instance_name]').val();
        var imageReg = this.model.id;
        var flavorReg, key_name, availability_zone;
        var security_groups = [];

        if ($("#id_keypair option:selected")[0].value !== '') {
            key_name = $("#id_keypair option:selected")[0].value;
        }

        flavorReg = $("#id_flavor option:selected")[0].value;

        $('input[name=security_groups]:checked').each(function () {
            security_groups.push($(this)[0].value);
        });

        var user_data = $('textarea[name=user_data]').val();
        var min_count = $('input[name=count]').val();
        var max_count = $('input[name=count]').val();

        instance.set({"name": name});
        instance.set({"imageReg": imageReg});
        instance.set({"flavorReg": flavorReg});
        instance.set({"key_name": key_name});
        instance.set({"user_data": user_data});
        instance.set({"security_groups": security_groups});
        instance.set({"min_count": min_count});
        instance.set({"max_count": max_count});
        instance.set({"availability_zone": availability_zone});

        instance.save(undefined, UTILS.Messages.getCallbacks("Instance "+instance.get("name") + " launched.", "Error launching instance "+instance.get("name"),
            {context:self, href:"#nova/instances/"}));


        /*instance.save(undefined, {success: function () {
            self.close();
            window.location.href = "#nova/instances/";
            var subview = new MessagesView({state: "Success", title: "Instance "+instance.get("name")+" launched."});
            subview.render();

        }, error: function (model, error) {
            self.close();
            console.log("Error: ", error);
            window.location.href = "#nova/instances/";
            var subview = new MessagesView({state: "Error", title: " Error launching instance "+instance.get("name") + ". Cause: " + error.message, info: error.body});
            subview.render();
        }});*/

        //this.options.addInstance(instance);
    }
});