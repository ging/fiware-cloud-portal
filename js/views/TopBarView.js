var TopBarView = Backbone.View.extend({
    
    _template: _.itemplate($('#topBarTemplate').html()),
    
    initialize: function() {
        this.model.bind('change:title', this.render, this);
        this.model.bind('change:subtitle', this.render, this);
        this.options.loginModel.bind('change:username', this.render, this);
    },
    
    render: function () {
        var self = this;
        this.model.set({'username': this.options.loginModel.get('username')});
        $(self.el).empty().html(self._template(self.model));
        return this;
    }
});