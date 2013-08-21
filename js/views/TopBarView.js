var TopBarView = Backbone.View.extend({

    _template: _.itemplate($('#topBarTemplate').html()),

    initialize: function() {
        this.model.bind('change:title', this.renderTitle, this);
        this.model.bind('change:subtitle', this.renderTitle, this);
        this.options.loginModel.bind('change:username', this.render, this);
    },

    render: function () {
        var self = this;
        this.model.set({'username': this.options.loginModel.get('username')});
        $(self.el).empty().html(self._template(self.model));
        return this;
    },

    renderTitle: function() {
        var html = '<h2 class="in-big-title" data-i18n="'+this.model.get('title') +'">'+this.model.get('title');
        if (this.model.has('subtitle')) {
            html += '<small>' + this.model.get('subtitle') + '</small>';
        }
        html += '</h2>';
        $('#page-title').html(html);
        return this;
    }
});