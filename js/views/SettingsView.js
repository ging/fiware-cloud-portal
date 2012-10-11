var SettingsView = Backbone.View.extend({
    
    _template: _.itemplate($('#settingsTemplate').html()),
    
    events : {
        'click #select': 'changeLang'
    },
    
    initialize: function() {
    },
    
    changeLang: function(evt) {
        $("select option:selected").each(function () {
            var lang = $(this).attr('value');
            UTILS.i18n.setlang(lang, function() {
                window.location.href="";
            });
            
        });
    },
    
    render: function () {
        $(this.el).empty().html(this._template());
    }
    
});