var SysOverviewView = Backbone.View.extend({
    
    _template: _.itemplate($('#sysOverviewTemplate').html()),
    
    initialize: function() { 
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        $("#option_id").selectbox();
        $("#option_id2").selectbox();
        return this;
    },
});