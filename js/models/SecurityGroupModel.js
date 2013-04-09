var SecurityGroup = Backbone.Model.extend({

    _action:function(method, options) {
        var model = this;
        if (options == null) options = {};
        options.success = function(resp) {

            model.trigger('sync', model, resp, options);
            if (options.callback !== undefined) {
                options.callback(resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);

        return xhr;
    },

    createSecurityGroupRule: function(ip_protocol, from_port, to_port, cidr, group_id, parent_group_id, options) {
        options = options || {};
        options.ip_protocol = ip_protocol;
        options.from_port = from_port;
        options.to_port = to_port;
        options.cidr = cidr;
        options.group_id = group_id;
        options.parent_group_id = parent_group_id;
        return this._action('createSecurityGroupRule', options);
    },

    deleteSecurityGroupRule: function(sec_group_rule_id, options) {
        console.log("Delete security group rule");
        options = options || {};
        options.secGroupRuleId = sec_group_rule_id;
        return this._action('deleteSecurityGroupRule', options);
    },

    getSecurityGroupforServer: function(server_id, options) {
        console.log("Get security groups for server");
        options = options || {};
        options.serverId = server_id;
        return this._action('getSecurityGroupforServer', options);
    },

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getsecuritygroupdetail(model.get("id"), options.success, options.error);
                   break;
               case "delete":
                   JSTACK.Nova.deletesecuritygroup(model.get("id"), options.success, options.error);
                   break;
               case "create":
                   JSTACK.Nova.createsecuritygroup( model.get("name"), model.get("description"), options.success, options.error);
                   break;
               case "createSecurityGroupRule":
               //console.log(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id);
                   JSTACK.Nova.createsecuritygrouprule(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id, options.success, options.error);
                   break;
                case "deleteSecurityGroupRule":
                   JSTACK.Nova.deletesecuritygrouprule(options.secGroupRuleId, options.success, options.error);
                   break;
                case "getSecurityGroupforServer":
                    mySuccess = function(object) {
                        var obj = {};
                        obj.object = object;
                        return options.success(obj);
                    };
                   JSTACK.Nova.getsecuritygroupforserver(options.serverId, mySuccess);
                   break;
           }
    },

    parse: function(resp) {
        if (resp.security_group !== undefined) {
            return resp.security_group;
        } else {
            return resp;
        }
    }
});

var SecurityGroups = Backbone.Collection.extend({
    model: SecurityGroup,

    sync: function(method, model, options) {
        if(method === "read") {
            JSTACK.Nova.getsecuritygrouplist(options.success, options.error);
        }
    },

    parse: function(resp) {
        return resp.security_groups;
    }

});