var EditSecurityGroupRulesView = Backbone.View.extend({

    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    events: {
      'click #closeModal': 'close',
      'click #deleteRuleBtn': 'deleteRule',
      'click #deleteRulesBtn': 'deleteRules',
      'click #cancel': 'close',
      'submit #rulesForm': 'createRule',
      'click .editSecGroup': 'close',
      'click #from_port': 'showTooltipFromPort',
      'click #to_port': 'showTooltipToPort',
      'click #cidr': 'showTooltipCidr',
      'change .secGroupSelect': 'dissapearCIDR',
      'change .IPProtocolSelect': 'changeInputs',
      'change .checkbox_sec_group_rule':'enableDisableDeleteButton'
    },

    initialize: function() {
        var self = this;
    },

    render: function () {
        $(this.el).append(this._template({model: this.model, securityGroupId: this.options.securityGroupId}));
        $('.modal:last').modal();
        $('.modal-backdrop').addClass("editSecGroup");
        return this;
    },

    autoRender: function () {

        $(this.el).find("#edit_security_group_rule").remove();
        $(this.el).append(self._template({model: this.model, securityGroupId: this.options.securityGroupId}));
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function () {
        $('#edit_security_group_rule').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },

    showTooltipFromPort: function() {
        $('#from_port').tooltip('show');
    },

    showTooltipToPort: function() {
        $('#to_port').tooltip('show');
    },

    showTooltipCidr: function() {
        $('#cidr').tooltip('show');
    },

    dissapearCIDR: function(e) {
        if ($('.secGroupSelect :selected').val()!=='CIDR') {
            $('.cidrSelect').hide();
        }else {
            if ($('.cidrSelect:hidden')) {
                $('.cidrSelect').show();
            }
        }
    },

    changeInputs: function(e) {
        if ($('.IPProtocolSelect :selected').val()=='ICMP') {
            $("label[for='from_port']").text("Type");
            $("label[for='to_port']").text("Code");
        }else {
            $("label[for='from_port']").text("From Port");
            $("label[for='to_port']").text("To Port");
        }
    },

    deleteRule: function (e) {
        self = this;
        var secGroupRuleId = e.target.value;
        var securityGroupsModel = this.model.get(this.options.securityGroupId);

        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rule", btn_message: "Delete Security Group Rule", onAccept: function() {
            securityGroupsModel.deleteSecurityGroupRule(secGroupRuleId, {callback: function (resp) {
                securityGroupsModel.fetch({success: function (resp) {
                    self.autoRender();
                    var subview2 = new MessagesView({state: "Success", title: "Security Group Rule deleted."});
                    subview2.render();
                }});
            }});
        }});
        subview.render();
    },

    deleteRules: function(e) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rules", btn_message: "Delete Security Group Rules", onAccept: function() {
            $(".checkbox_sec_group_rule:checked").each(function () {
                var secGroupRuleId = $(this).val();
                var securityGroupsModel = self.model.get(self.options.securityGroupId);

                securityGroupsModel.deleteSecurityGroupRule(secGroupRuleId, {callback: function (resp) {
                    securityGroupsModel.fetch({success: function (resp) {
                        self.autoRender();
                        var subview2 = new MessagesView({state: "Success", title: "Security Group Rules deleted."});
                        subview2.render();
                    }});
                }});
            });
        }});
        subview.render();
    },

    createRule: function(e) {
        e.preventDefault();
        self = this;

        var cidrOK, fromPortOK, toPortOK;
        var cidr_pattern = /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\/(\d|[0-2]\d|3[0-2])$/;   // 0.0.0.0/0
        //var portPattern = /^([1-65535]){1,5}$/;
        //var icmpPattern = /^([\-1-255]){1,3}$/;

        var parentGroupId = this.options.securityGroupId;
        var ipProtocol = $('.IPProtocolSelect :selected').val();
        var fromPort = $('input[name=fromPort]').val();
        var toPort = $('input[name=toPort]').val();
        var sourceGroup = $('.secGroupSelect :selected').val();
        var cidr = $('input[name=cidr]').val();

        var subview;

        cidrOK = cidr_pattern.test(cidr);
        fromPortOK = (fromPort >= -1 && fromPort <= 65535);
        toPortOK = (toPort >= -1 && toPort <= 65535);

        var securityGroupsModel = self.model.get(this.options.securityGroupId);

        for (var index in securityGroupsModel.get('rules')) {
            var securityGroupRules = securityGroupsModel.get('rules')[index];

            var thisIpProtocol = securityGroupRules.ip_protocol.toUpperCase();
            var thisFromPort = securityGroupRules.from_port;
            var thisToPort = securityGroupRules.to_port;
            var thisSourceGroup = securityGroupRules.group.name;
            var thisCidr = securityGroupRules.ip_range.cidr;

            if ((ipProtocol == thisIpProtocol)&&(fromPort == thisFromPort)&&(toPort == thisToPort)) {
                console.log("first three equal");
                if ((sourceGroup == thisSourceGroup)||(cidr == thisCidr)) {
                    subview = new MessagesView({state: "Error", title: "Security Group Rule already exists. Please try again."});
                    subview.render();
                    return false;
                }
            }

        }

        if (cidrOK && fromPortOK && toPortOK) {
            if ($('.secGroupSelect :selected').val()!=='CIDR') {
                securityGroupsModel.createSecurityGroupRule(ipProtocol, fromPort, toPort, "", sourceGroup, parentGroupId, {callback: function (resp) {
                   securityGroupsModel.fetch({success: function (resp) {
                        self.autoRender();
                        subview = new MessagesView({state: "Success", title: "Security group rule created."});
                        subview.render();
                    }});
                }});
            } else {
                securityGroupsModel.createSecurityGroupRule(ipProtocol, fromPort, toPort, cidr, undefined , parentGroupId, {callback: function (resp) {
                    securityGroupsModel.fetch({success: function (resp) {
                        self.autoRender();
                        subview = new MessagesView({state: "Success", title: "Security group rule created."});
                        subview.render();
                    }});
                }});
            }


        } else {
            subview = new MessagesView({state: "Error", title: "Wrong input values for Security Group Rule. Please try again."});
            subview.render();
        }
    },

    enableDisableDeleteButton: function (e) {
        if ($(".checkbox_sec_group_rule:checked").size() > 0) {
            $("#deleteRulesBtn").attr("disabled", false);
        } else {
            $("#deleteRulesBtn").attr("disabled", true);
        }
    }
});