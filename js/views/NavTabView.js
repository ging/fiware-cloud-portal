var NavTabView = Backbone.View.extend({
    
    _template: _.template($('#navTabTemplate').html()),
    
    initialize: function() {
        this.model.bind('change:actives', this.render, this);
    },
    
    render: function () {
        console.log("Rendering NavTabView");
        var self = this;
        $(self.el).empty().html(self._template(self.model));
        return this;
    }
    
});