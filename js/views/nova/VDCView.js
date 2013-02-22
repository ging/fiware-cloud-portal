var VDCView = Backbone.View.extend({

    _template: _.itemplate($('#novaVDCTemplate').html()),

    dropdownId: undefined,
    timer: undefined,

    initialize: function() {
        var that = this;
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.model.fetch();
        this.timer = setInterval(function() {
            that.model.fetch();
        }, 4000);
    },

    events:{
        'click .btn-launch':'onCreateService',
        'click .btn-edit-service':'onEditService',
        'click .btn-delete':'onDeleteService'
    },

    onClose: function() {
        this.model.unbind("reset");
        this.undelegateEvents();
        this.unbind();
        clearInterval(this.timer);
    },

    onCreateService: function(evt) {
        var subview = new CreateVDCServiceView({el: 'body', flavors: this.options.flavors, images: this.options.images, keypairs: this.options.keypairs});
        subview.render();
    },

    onEditService: function(evt) {
        var service = evt.target.value;
        //var subview = new UpdateServiceView({el: 'body', model: this.model.get(service)});
        //subview.render();
    },

    onDeleteService: function(evt) {
        var service = this.model.get(evt.target.value);
        var subview = new ConfirmView({el: 'body', title: "Delete Service", btn_message: "Delete VDC", message: "Please confirm your selection. This action cannot be undone and will delete all Instances associated to this Service.", onAccept: function() {
            vdc.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "Service " + service.get("name") + " deleted."});
            subview.render();
        }});

        subview.render();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {models:this.model.models, vdc:this.options.vdc});
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },

    renderSecond: function (evt) {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
            var new_template = this._template({models:this.model.models, vdc: this.options.vdc});
            var dropdowns = [];
            var index, instanceId, drop;
            for (index in this.model.models) {
                instanceId = this.model.models[index].id;
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);

            for (index in dropdowns) {
                instanceId = dropdowns[index];
                drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
        }
        return this;
    },

    render: function () {
        if ($("#vdc").html() == null) {
            this.renderFirst();
        } else {
            this.renderSecond();
        }
    }

});