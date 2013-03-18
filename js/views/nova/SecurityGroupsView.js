var NovaSecurityGroupsView = Backbone.View.extend({

    _template: _.itemplate($('#novaSecurityGroupsTemplate').html()),

    initialize: function() {
        this.options.securityGroupsModel.unbind("reset");
        this.options.securityGroupsModel.bind("reset", this.render, this);
        this.renderFirst();
    },

    events: {
        'click .btn-edit-rules-actions' : 'onEditRules',
        'click .btn-delete-sec-group-actions':'deleteSecurityGroups',
        'change .checkbox_sec_groups':'enableDisableDeleteButton',
        'change .checkbox_all':'checkAll',
        'click .btn-create-sec-group':'createSecurityGroup',
        'click .btn-edit':'editSecurityGroupRules',
        //'click #sec_groups_delete':'deleteSecurityGroups',
        'click #sec_delete':'deleteSecurityGroup'
    },

    onEditRules: function (e) {
        var self = this;
        var securityGroup = $(".checkbox_sec_groups:checked").val();
        var subview = new EditSecurityGroupRulesView({el: 'body', securityGroupId: securityGroup, model: this.options.securityGroupsModel});
        subview.render();
    },

    onClose: function() {
        //this.options.securityGroupsModel.unbind("reset");
        this.undelegateEvents();
        this.unbind();
    },

    createSecurityGroup: function (e) {
        var subview = new CreateSecurityGroupView({el: 'body', securityGroupsModel: this.options.securityGroupsModel});
        subview.render();
    },

    editSecurityGroupRules: function (e) {
        var subview = new EditSecurityGroupRulesView({el: 'body', securityGroupId: e.target.value, model: this.options.securityGroupsModel});
        subview.render();
    },

     deleteSecurityGroup: function (e) {
        var secGroup;
        for (var index in this.options.securityGroupsModel.models) {
             if (this.options.securityGroupsModel.models[index].id == e.target.value) {
                var securityGroup = this.options.securityGroupsModel.models[index];
                secGroup = securityGroup;
             }
        }
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group", btn_message: "Delete Security Group", onAccept: function() {
            secGroup.destroy();
            var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Group "+secGroup.attributes.name+" deleted."});
            subview2.render();
        }});
        subview.render();
    },

     deleteSecurityGroups: function(e) {
        var secGroup;
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Security Groups", btn_message: "Delete Security Groups", onAccept: function() {
            $(".checkbox_sec_groups:checked").each(function () {
                    var secGroupId = $(this).val();
                    for (var index in self.options.securityGroupsModel.models) {
                         if (self.options.securityGroupsModel.models[index].id == secGroupId) {
                            var securityGroup = self.options.securityGroupsModel.models[index];
                            secGroup = securityGroup;
                         }
                    }
                    secGroup.destroy();
                    var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Groups "+secGroup.attributes.name+" deleted."});
                    subview2.render();
            });
        }});
        subview.render();
    },

    checkAll: function () {
        if ($(".checkbox_all:checked").size() > 0) {
            $(".checkbox_sec_groups").attr('checked','checked');
            $(".btn-edit-rules-actions").hide();
            this.enableDisableDeleteButton();
        } else {
            $(".checkbox_sec_groups").attr('checked',false);
            $(".btn-edit-rules-actions").show();
            this.enableDisableDeleteButton();
        }
        
    },

    enableDisableDeleteButton: function (e) {
        var self, secGroup, securityGroup;
        self = this;
        secGroup = $(".checkbox_sec_groups:checked").val();

        for (var index in self.options.securityGroupsModel.models) {
            if (self.options.securityGroupsModel.models[index].id == secGroup) {
                securityGroup = self.options.securityGroupsModel.models[index];
            }
        }
        if ($(".checkbox_sec_groups:checked").size() > 0) {       
            $("#sec_groups_delete").attr("disabled", false);
            $(".btn-edit-rules-actions").attr("disabled", false);
            $(".btn-delete-sec-group-actions").attr("disabled", false);

            if (securityGroup.attributes.name !== 'default') {
                $(".btn-delete-sec-group-actions").show();
            } else {
                $(".btn-delete-sec-group-actions").hide();
            }
            if ($(".checkbox_sec_groups:checked").size() > 1) {
                $(".btn-edit-rules-actions").hide();
                $(".btn-delete-sec-group-actions").show();
            } else {
                $(".btn-edit-rules-actions").show();
            } 
        } else {
            $("#sec_groups_delete").attr("disabled", true);
            $(".btn-edit-rules-actions").attr("disabled", true);
            $(".btn-delete-sec-group-actions").attr("disabled", true);
        }
    },

    renderFirst: function () {
        this.undelegateEvents();
        var that = this;
        UTILS.Render.animateRender(this.el, this._template, {securityGroupsModel: this.options.securityGroupsModel}, function() {
            that.enableDisableDeleteButton();
            that.delegateEvents(that.events);
        });

    },

    render: function () {
        this.undelegateEvents();

        if ($('.messages').html() != null) {
            $('.messages').remove();
        }
        if ($("#security_groups").html() != null) {
            var new_template = this._template({securityGroupsModel: this.options.securityGroupsModel});
            var checkboxes = [];
            var dropdowns = [];
            var index, secGroupsId, check, drop, drop_actions_selected;
            for (index in this.options.securityGroupsModel.models) {
                secGroupsId = this.options.securityGroupsModel.models[index].id;
                if ($("#checkbox_sec_groups_"+secGroupsId).is(':checked')) {
                    checkboxes.push(secGroupsId);
                }
                if ($("#dropdown_"+secGroupsId).hasClass('open')) {
                    dropdowns.push(secGroupsId);
                }
                if ($("#dropdown_actions").hasClass('open')) {
                    drop_actions_selected = true;
                } 
            }
            $(this.el).html(new_template);
            for (index in checkboxes) {
                secGroupsId = checkboxes[index];
                check = $("#checkbox_sec_groups_"+secGroupsId);
                if (check.html() != null) {
                    check.prop("checked", true);
                }
            }
            for (index in dropdowns) { 
                secGroupsId = dropdowns[index];
                drop = $("#dropdown_"+secGroupsId);
                if (drop.html() != null) {
                    drop.addClass("open");
                }
            }
            if (($("#dropdown_actions").html() !== null) && (drop_actions_selected)) {
                $("#dropdown_actions").addClass("open");
            }
           this.enableDisableDeleteButton();
        }
        this.delegateEvents(this.events);

        return this;
    }
});