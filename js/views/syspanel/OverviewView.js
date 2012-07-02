var SysOverviewView = Backbone.View.extend({
    
    _template: _.itemplate($('#sysOverviewTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        UTILS.Render.animateRender(this.el, this._template, this.model);
        return this;
    },
});