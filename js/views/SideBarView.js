var SideBarView = Backbone.View.extend({

    _template: _.itemplate($('#sideBarTemplate').html()),

    initialize: function() {
        this.model.bind('change:actives', this.render, this);
        this.options.loginModel = UTILS.GlobalModels.get("loginModel");
        this.options.loginModel.bind('change:tenant_id', this.render, this);
    },

    render: function (title, showTenants) {
        var self = this;
        var html = self._template({models: self.model.models, showTenants: showTenants, loginModel: this.options.loginModel, title: title});
        $(self.el).empty();
        $(self.el).html(html);
        $("#tenant_switcher").selectbox({
            onChange: function (val, inst) {
                window.location = val;
            }
        });
               
        $('.chosen-select' ).chosen().change(function(){
            val = $('.chosen-select').chosen().val();
                console.log("region: ", val);
                window.location = val;
            });
        
        // $("#region_switcher").selectbox({
        //     onChange: function (val, inst) {
        //         window.location = val;
        //     }
        // });
    }

});