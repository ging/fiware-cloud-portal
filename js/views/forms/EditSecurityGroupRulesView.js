var EditSecurityGroupRulesView = Backbone.View.extend({

    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    events: {
      'click #closeModal': 'close',
      'click #deleteRuleBtn': 'deleteRule',
      'click #deleteRulesBtn': 'deleteRules',
      'click .close': 'close',
      'submit #rulesForm': 'createRule',
      'click .modal-backdrop': 'close',
      'click #from_port': 'showTooltipFromPort',
      'click #to_port': 'showTooltipToPort',
      'click #cidr': 'showTooltipCidr',
      'change .secGroupSelect': 'dissapearCIDR',
      'change .IPProtocolSelect': 'changeInputs',
      'change .checkbox_sec_group_rule':'enableDisableDeleteButton'
    },

    render: function () {
        $(this.el).append(this._template({securityGroupsModel: this.options.securityGroupsModel}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        $('#edit_security_group_rule').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
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
        var securityGroupRule;

        for (var index in this.options.securityGroupsModel.securityGroup.attributes.rules) {
             if (this.options.securityGroupsModel.securityGroup.attributes.rules[index].id == e.target.value) {
                var secGroupRule = this.options.securityGroupsModel.securityGroup.attributes.rules[index];
                securityGroupRule = secGroupRule;
             }
        }
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rule", btn_message: "Delete Security Group Rule", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            self.options.securityGroupsModel.securityGroup.deleteSecurityGroupRule(secGroupRuleId);
            var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Group Rule deleted."});
            subview2.render();
        }});
        subview.render();

    },


    deleteRules: function(e) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rules", btn_message: "Delete Security Group Rules", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            $(".checkbox_sec_group_rule:checked").each(function () {
                    var secGroupRuleId = $(this).val();
                    for (var index in self.options.securityGroupsModel.securityGroup.attributes.rules) {
                         if (self.options.securityGroupsModel.securityGroup.attributes.rules[index].id == secGroupRuleId) {
                            var secGroupRule = self.options.securityGroupsModel.securityGroup.attributes.rules[index];
                         }
                    }

            var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Group Rules deleted."});
            self.options.securityGroupsModel.securityGroup.deleteSecurityGroupRule(secGroupRuleId);
            subview2.render();
            });
        }});
        subview.render();

    },

    createRule: function(e) {
        e.preventDefault();
        self = this;

        var cidrOK, fromPortOK, toPortOK;
        var cidr_pattern = /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\/(0|[12]\d?|3[0-2])$/;   // 0.0.0.0/0
        var portPattern = /^([1-65535]){1,5}$/;
        var icmpPattern = /^([\-1-255]){1,3}$/;

        var parentGroupId = self.options.securityGroupsModel.securityGroup.id;
        var ipProtocol = $('.IPProtocolSelect :selected').val();
        var fromPort = $('input[name=fromPort]').val();
        var toPort = $('input[name=toPort]').val();
        var securityGroupId = $('.secGroupSelect :selected').val();
        var cidr = $('input[name=cidr]').val();

        var subview;

        cidrOK = cidr_pattern.test(cidr) ? true : false;

        fromPortOK = portPattern.test(fromPort) ? true : false;

        toPortOK = portPattern.test(toPort) ? true : false;

        console.log("ipProtocol "+ipProtocol);
        console.log("fromPort "+fromPort);
        console.log("toPort "+toPort);
        console.log("cidr "+cidr);
        console.log("securityGroupId "+securityGroupId);
        console.log("parentGroupId "+parentGroupId);

        if ( cidrOK && fromPortOK && toPortOK ) {
            if ($('.secGroupSelect :selected').val()!=='CIDR') {
                self.options.securityGroupsModel.securityGroup.createSecurityGroupRule(ipProtocol, fromPort, toPort, "", securityGroupId, parentGroupId);
            }else{
                self.options.securityGroupsModel.securityGroup.createSecurityGroupRule(ipProtocol, fromPort, toPort, cidr, undefined , parentGroupId);
            }
        subview = new MessagesView({el: '#content', state: "Success", title: "Security group rule created."});
        subview.render();

        }else{
            subview = new MessagesView({el: '#content', state: "Error", title: "Wrong input values for Security Group Rule. Please try again."});
            subview.render();
        }
        this.close();
    },

    enableDisableDeleteButton: function (e) {
        if ($(".checkbox_sec_group_rule:checked").size() > 0) {
            $("#deleteRulesBtn").attr("disabled", false);
        } else {
            $("#deleteRulesBtn").attr("disabled", true);
        }
    }
});