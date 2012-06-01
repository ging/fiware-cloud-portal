var NovaVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaInstancesTemplate').html()),
    _template: _.itemplate($('#novaVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    events: {
        'change .checkbox_volumes':'enableDisableDeleteButton',
        'click .btn-create':'onCreate',
        'click .btn-terminate':'onDelete',
        'click .btn-terminate-group':'onDeleteGroup'
    },
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    onCreate: function(evt) {
        var instance = evt.target.value;
        var subview = new CreateVolumeView({el: 'body'});
        subview.render();
    },
    
    onDelete: function(evt) {
        var instance = evt.target.value;
        var inst = this.model.get(instance);
        var subview = new ConfirmView({el: 'body', title: "Terminate Instance", btn_message: "Terminate Instance", onAccept: function() {
            inst.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Instance "+inst.get("name")+" terminated."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volumes", onAccept: function() {
            $(".checkbox_volumes:checked").each(function () {
                    var volume = $(this).val(); 
                    var vol = self.model.get(volume);
                    vol.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});     
                    subview.render();
            });
        }});
        subview.render();
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_volumes:checked").size() > 0) { 
            $("#volumes_delete").attr("disabled", false);
        } else {
            $("#volumes_delete").attr("disabled", true);
        }
        
    },
    
    renderFirst: function() {
        $(this.el).html(this._template({models:this.model.models, flavors:this.options.flavors}));
        this.undelegateEvents();
        this.delegateEvents(this.events);
    },
        
    render: function () {
        this.undelegateEvents();
        this.delegateEvents(this.events);
        if ($(this.el).html() != null) {
            var new_template = this._template({models:this.model.models, flavors:this.options.flavors});
            var checkboxes = [];
            var dropdowns = [];
            for (var index in this.model.models) { 
                var instanceId = this.model.models[index].id;
                if ($("#checkbox_"+instanceId).is(':checked')) {
                    checkboxes.push(instanceId);
                }
                if ($("#dropdown_"+instanceId).hasClass('open')) {
                    dropdowns.push(instanceId);
                }
            }
            $(this.el).html(new_template);
            for (var index in checkboxes) { 
                var instanceId = checkboxes[index];
                var check = $("#checkbox_"+instanceId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            
            for (var index in dropdowns) { 
                var instanceId = dropdowns[index];
                var drop = $("#dropdown_"+instanceId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            
        }
        this.enableDisableDeleteButton();
        return this;
    }
    
});