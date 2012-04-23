var InstancesAndVolumesView = Backbone.View.extend({
    
    _template: _.template($('#novaInstancesAndVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.model.fetch();
    },
    
    events:{
        'change .checkbox':'enableDisableTerminateButton',
    },
    
    enableDisableTerminateButton: function () {
        for (var index in this.model.models) { 
            var instance = this.model.models[index];
            var instanceId = instance.get('id');
            if($("#checkbox_"+instanceId).is(':checked'))
            {
                    console.log("checked");
                    $("#instances_terminate").attr("disabled", false);
                    return;
            }
        }
        $("#instances_terminate").attr("disabled", true);
    },
    
    render: function () {
        if ($("#instances").html() == null) {
            UTILS.Render.animateRender(this.el, this._template, this.model);
        } else {
            var new_template = this._template(this.model);
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
        this.enableDisableTerminateButton();
        return this;
    }
    
});