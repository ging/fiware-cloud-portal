var Container = Backbone.Model.extend({
	
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
    
    copyObject: function(object, container) {
    	console.log("Copy object");
    	var options = options || {};
    	options.container = container;
    	options.object = object;
    	return this._action('copyObject', options);
    },
    
    uploadObject: function(container, objectName, object) {
    	console.log("Upload object");
    	var options = options || {};
    	options.container = container;
    	options.objectName = objectName;
    	options.object = object;    	
    	return this._action('uploadObject', options);
    },
    
    downloadObject: function(container, object) {
    	console.log("Download object");
    	var options = options || {};
    	options.container = container;
    	options.object = object;
    	return this._action('downloadObject', options);
    },
    
    deleteObject: function(container, options) {
    	console.log("Delete object");
    	var options = options || {};
    	options.container = container;
    	return this._action('deleteObject', options);
    },
    
    deleteObjects: function(container, options) {
    	console.log("Delete objects");
    	var options = options || {};
    	options.container = container;  
    	console.log(options.container);  	
    	return this._action('deleteObject', options);   	
    },
   
    sync: function(method, model, options) {
           switch(method) {
               case "read":                                     
                   mySucess = function(objects) {
                   		var cont = {};
                   		cont.objects = objects;
                   		return options.success(cont);
                   };                            
                   CDMI.Actions.getobjectlist(model.get('name'), mySucess);                    
                   break;
               case "delete":
                   CDMI.Actions.deletecontainer(model.get('name'), options.success);    
                   break;
               case "create":
                   CDMI.Actions.createcontainer(model.get('name'), options.success);    
                   break;
               case "copyObject":
                	CDMI.Actions.copyobject(options.object, options.container, options.success);  
               	 	model.fetch();
               	 	break; 
               case "uploadObject":
                	CDMI.Actions.uploadobject(options.container, options.objectName, options.object, options.success);  
               	 	model.fetch();
               	 	break; 	
               case "downloadObject":
               		mySucess = function(object) {
                   		console.log(object);
                   		var obj = {};
                   		obj.object = object;
                   		console.log(obj.object);
                   		return options.success(obj);
                   		
                   	};                            
               		CDMI.Actions.downloadobject(options.container, options.object, mySucess);  
               	 	//var body = JSON.stringify(obj);
               	 	//console.log(body);
               	 	//return(body);
               	 	break; 
               case "deleteObject":
	               	if (options.name !== undefined){
	               		CDMI.Actions.deleteobject(options.container, options.name, options.success);
	               		model.fetch();
	               		break;  
	               	} else {
	               		for (var index in options) {
	               			options.name = options[index].name;   
	               			if (options.name !== undefined && options.name !== ""){
	                			CDMI.Actions.deleteobject(options.container, options.name, options.success);
	                		}
	               	}
	               	model.fetch();
	               	break;    
	               	}            		  				 		  
           }
    },
    
    parse: function(resp) {
    	//console.log("Parse container", resp);
    	if (resp.container !== undefined) {
    		resp.container.id = resp.container.name;
    		return resp.container;
    	} else {
    		resp.id = resp.name;
    		return resp;
    	}            
    }
});

var Containers = Backbone.Collection.extend({
    model: Container,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
               	CDMI.Actions.getcontainerlist(options.success);              
                break;
        }
    },
    
    comparator: function(container) {
        return container.get("id");
    },
    
    parse: function(resp) {
        return resp;
    }
    
});