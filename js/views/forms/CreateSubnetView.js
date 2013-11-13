var CreateSubnetView = Backbone.View.extend({

    _template: _.itemplate($('#createSubnetFormTemplate').html()),

    events: {
      'click #cancelBtn-subnet': 'close',
      'click .close': 'close',
      'click .modal-backdrop': 'close',
      'submit #form': 'create'
    },

    initialize: function() {
    },

    render: function () {
        var flavors = this.options.flavors;
        if ($('#create_subnet').html() != null) {
            return;
        }
        $(this.el).append(this._template({model:this.model, flavors: flavors, keypairs: this.options.keypairs, secGroups: this.options.secGroups}));
        $('#create_subnet').modal();
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
        $('#create_subnet').remove();
        $('.modal-backdrop:last').remove();
        this.onClose();
        this.model.unbind("sync", this.render, this);
    },

    create: function(e) {
        var self = this;

        var network = new Network();
        var name = $('input[name=network]').val();
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

        network.set({"name": name});


        instance.save(undefined, UTILS.Messages.getCallbacks("Subnet "+network.get("name") + " created.", "Error creating subnet "+network.get("name"),
            {context:self, href:"#neutron/networks/"}));

    }
});