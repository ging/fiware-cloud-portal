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

    initialize: function() {
        var self = this;
    },

    render: function () {
        $(this.el).append(this._template({model: this.model, securityGroupId: this.options.securityGroupId}));
        $('.modal:last').modal();
        return this;
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

        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rule", btn_message: "Delete Security Group Rule", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            self.model.get(self.options.securityGroupId).deleteSecurityGroupRule(secGroupRuleId);
            var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Group Rule deleted."});
            subview2.render();
            self.render();
        }});
        subview.render();

    },


    deleteRules: function(e) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Security Group Rules", btn_message: "Delete Security Group Rules", style: "top: 80px; display: block; z-index: 10501010;", onAccept: function() {
            $(".checkbox_sec_group_rule:checked").each(function () {
                var secGroupRuleId = $(this).val();
                var subview2 = new MessagesView({el: '#content', state: "Success", title: "Security Group Rules deleted."});
                self.model.get(self.options.securityGroupId).deleteSecurityGroupRule(secGroupRuleId);
                subview2.render();
                self.render();
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
        var securityGroupId = $('.secGroupSelect :selected').val();
        var cidr = $('input[name=cidr]').val();

        var subview;

        cidrOK = cidr_pattern.test(cidr);
        fromPortOK = (fromPort >= -1 && fromPort <= 65535);
        toPortOK = (toPort >= -1 && toPort <= 65535);


        console.log("ipProtocol "+ipProtocol);
        console.log("fromPort "+fromPort);
        console.log("toPort "+toPort);
        console.log("cidr "+cidr);
        console.log("securityGroupId "+securityGroupId);
        console.log("parentGroupId "+parentGroupId);
        console.log(cidrOK, fromPortOK, toPortOK);

        var securityGroupsModel = self.model.get(this.options.securityGroupId);

        if ( cidrOK && fromPortOK && toPortOK ) {
            if ($('.secGroupSelect :selected').val()!=='CIDR') {
                securityGroupsModel.createSecurityGroupRule(ipProtocol, fromPort, toPort, "", securityGroupId, parentGroupId);
            }else{
                securityGroupsModel.createSecurityGroupRule(ipProtocol, fromPort, toPort, cidr, undefined , parentGroupId);
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