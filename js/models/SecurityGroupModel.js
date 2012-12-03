var SecurityGroup = Backbone.Model.extend({
	
	_action:function(method, options) {
        var model = this;
        if (options == null) options = {};
        options.success = function(resp) {
        	
            model.trigger('sync', model, resp, options);
            if (options.callback!=undefined) {
                options.callback(resp);
            }
        }
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        
        return xhr;
    },
    
    createSecurityGroupRule: function(ip_protocol, from_port, to_port, cidr, group_id, parent_group_id, options) {
    	console.log("Upload object");
    	var options = options || {};
    	options.container = container;
    	options.objectName = objectName;
    	options.object = object;    	
    	return this._action('createSecurityGroupRule', options);
    },
    
    deleteSecurityGroupRule: function(sec_group_rule_id, options) {
    	console.log("Delete security group rule");
    	var options = options || {};
    	options.secGroupRuleId = sec_group_rule_id;   	
    	return this._action('deleteSecurityGroupRule', options);
    },
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   JSTACK.Nova.getsecuritygroupdetail(model.get("id"), options.success);
                   break;
               case "delete":
                   JSTACK.Nova.deletesecuritygroup(model.get("id"), options.success);
               	   break;
               case "create":
                   JSTACK.Nova.createsecuritygroup( model.get("name"), model.get("description"), options.success);
                   break;
               case "createSecurityGroupRule":
                   JSTACK.Nova.createsecuritygrouprule( model.get("name"), model.get("description"), options.success);
                   break;
             	case "deleteSecurityGroupRule":
                   JSTACK.Nova.deletesecuritygrouprule(options.secGroupRuleId, options.success);
                   break;    
               
           }
    },
    
    parse: function(resp) {
        if (resp.security_group != undefined) {
            return resp.security_group;
        } else {
            return resp;
        }
    }
});

var SecurityGroups = Backbone.Collection.extend({
    model: SecurityGroup,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getsecuritygrouplist(options.success);
                break;
        }
    },
   
    parse: function(resp) {
        return resp.security_groups;
    }
    
});