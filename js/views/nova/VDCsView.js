var VDCsView = Backbone.View.extend({

    _template: _.itemplate($('#novaVDCsTemplate').html()),

    dropdownId: undefined,

    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },

    events:{
        'click .btn-launch':'onLaunch',
        'click .btn-edit-vdcs':'onEditVDC',
        'click .btn-delete':'onDeleteVDC'
    },

    onLaunch: function() {
        var subview = new LaunchVDCView({el: 'body'});
        subview.render();
    },

    onClose: function() {
        this.model.unbind("reset", this.render, this);
        this.undelegateEvents();
        this.unbind();
    },

    onEditVDC: function(evt) {
        var vdc = evt.target.value;
        //var subview = new UpdateVDCView({el: 'body', model: this.model.get(vdc)});
        //subview.render();
    },

    onDeleteVDC: function(evt) {
        var vdc = this.model.get(evt.target.value);
        var subview = new ConfirmView({el: 'body', title: "Delete VDC", btn_message: "Delete VDC", message: "Please confirm your selection. This action cannot be undone and will delete all Services and Instances associated to this Virtual Data Center", onAccept: function() {
            vdc.destroy();
            var subview = new MessagesView({el: '#content', state: "Success", title: "VDC " + vdc.get("name") + " deleted."});
            subview.render();
        }});

        subview.render();
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },

    render: function (evt) {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
            var new_template = this._template({models:this.model.models});
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
    }

});