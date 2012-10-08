var VDCsView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVDCsTemplate').html()),
    
    dropdownId: undefined,
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    events:{
        'click .btn-edit-vdcs':'onEditVDC',
        'click .btn-delete':'onDeleteVDC',
    },
    
    onClose: function() {
        this.model.unbind("reset");
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
            for (var index in this.model.models) { 
                var instanceId = this.model.models[index].id;
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            
            for (var index in dropdowns) { 
                var instanceId = dropdowns[index];
                var drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
        }
        return this;
    }
    
});