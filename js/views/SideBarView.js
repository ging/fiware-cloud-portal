var SideBarView = Backbone.View.extend({

    _template: _.itemplate($('#sideBarTemplate').html()),

    initialize: function() {
        this.model.bind('change:actives', this.render, this);
        this.options.loginModel = UTILS.GlobalModels.get("loginModel");
        this.options.loginModel.bind('change:tenant_id', this.render, this);
      
        $('#accept_region_modal_button').on('click', function (e) {
            $('#no_sanity_modal').unbind('hidden');
            $('#no_sanity_modal').modal('hide');
            console.log("Switching to: ", val);
            window.location = $('.chosen-select').chosen().val();
        });
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
            
            var region = $('.chosen-select').find(":selected").text();
            var status = UTILS.Auth.getRegionStatus(region);

            if (status === 'down') {
                $('#no_sanity_modal').on('hidden.bs.modal', function (e) {
                    $('#no_sanity_modal').unbind('hidden');
                    console.log("Returning to: ", UTILS.Auth.getCurrentRegion());
                    window.location.href = '#reg/switch/' + UTILS.Auth.getCurrentRegion() + '/';
                });
                $('#no_sanity_modal').modal();
            } else {
                console.log("Switching to: ", val);
                window.location = val;
            }
        });

        $('.btn-openrc').on('click', this.openModal);
        
        // $("#region_switcher").selectbox({
        //     onChange: function (val, inst) {
        //         window.location = val;
        //     }
        // });
    },

    openModal: function() {
        var subview = new DownloadOpenrcView({el: 'body'});
        subview.render();
    }
});