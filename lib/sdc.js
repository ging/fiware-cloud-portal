var ServiceDC = ServiceDC || {};

// Current version is **0.1**.

ServiceDC.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
ServiceDC.AUTHORS = 'GING';

ServiceDC.API = (function (_ServiceDC, undefined) {

	var x2js;
	var vdc_id;
	//var sdcUrl = 'http://130.206.80.112:8080/sdc/rest/';
	//var sdcUrl = 'http://130.206.80.93/sdc/rest/';
	var sdcUrl = '/sdc/rest/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';


	var check = function (region, recipe) {
		x2js = x2js || new X2JS();
		vdc_id = vdc_id || JSTACK.Keystone.params.access.token.tenant.id;
		var def = '/sdc/rest/';
		if (recipe) {
			def = '/cookbookcheck/rest/';
		}

		if (UTILS.Auth.getRegions().indexOf(region) !== -1) {
			sdcUrl = region + def;
		} else {
			sdcUrl = UTILS.Auth.getRegions()[0] + def;
		}
	}
	
	var sendRequest = function (method, url, body, callback, callbackError) {

		var req = new XMLHttpRequest();
		var token = JSTACK.Keystone.params.token;

		req.onreadystatechange = onreadystatechange = function () {

	  		if (req.readyState == '4') {

	  			switch (req.status) {

	                case 100:
	                case 200:
	                case 201:
	                case 202:
	                case 203:
	                case 204:
	                case 205:
	                    //console.log('Respuesta: ', req.responseText);
	    				callback(req.responseText);
	                    break;
	                case 400:
	                    callbackError("400 Bad Request");
	                    break;
	                case 401:
	                    callbackError("401 Unauthorized");
	                    break;
	                case 403:
	                    callbackError("403 Forbidden");
	                    break;
	                default:
	                    callbackError(req.status + " Error" + req.responseText);
                }
	    	}
		}

		req.open(method, sdcUrl + url, true);

		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('X-Auth-Token', token);
	    req.setRequestHeader('Tenant-ID', vdc_id);
		req.send(body);

	};

	//Product Catalogue

	var getProductList = function (callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'catalog/product', undefined, function (resp) {
			var productList = x2js.xml_str2json(resp);
			callback(productList.products);
		}, callbackError);
	};

	var addProduct = function (name, description, attributes, callback, callbackError, region) {

		check(region);

		//attributes: array of jsons
		var p = {product: {name: name, description: description, attributes: attributes}};
		var xmlProduct = xmlHead + x2js.json2xml_str(p);

		sendRequest('POST', 'catalog/product', xmlProduct, function (resp) {
			callback(resp);
		}, callbackError);
	};

	var getProduct = function (product_id, callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'catalog/product/' + product_id, undefined, function (resp) {
			var product = x2js.xml_str2json(resp);
			callback(product.product);
		}, callbackError);
	};

	var getProductReleases = function (product_id, callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'catalog/product/' + product_id + '/release', undefined, function (resp) {
			var productReleases = x2js.xml_str2json(resp);
			callback(productReleases.productReleases);
		}, callbackError);
	};

	var deleteProduct = function (product_id, callback, callbackError, region) {

		check(region);

		sendRequest('DELETE', 'catalog/product/' + product_id, undefined, function (resp) {
			callback();
		}, callbackError);
	};

	var getProductAttributes = function (product_id, callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'catalog/product/' + product_id + '/attributes', undefined, function (resp) {
			var attributes = x2js.xml_str2json(resp);
			callback(attributes.attributes.attribute_asArray);
		}, callbackError);
	};

	//Product Provisioning

	var installProductInstance = function (ip, fqn, product, callback, callbackError, region) {

		check(region);

		var i = {productInstanceDto: {vm: {ip: ip, fqn: fqn, osType: "", hostname: ""}, product: product}};

		var xmlInstance = xmlHead + x2js.json2xml_str(i);

		sendRequest('POST', 'vdc/' + vdc_id + '/productInstance', xmlInstance, function (resp) {
			callback(resp);
		}, callbackError);
	};

	var getProductInstanceList = function (callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance', undefined, function (resp) {
			var productInstances = x2js.xml_str2json(resp);
			callback(productInstances.productInstances.productInstance);
		}, callbackError);
	};

	var getProductInstance = function (productInstance_id, callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var productInstance = x2js.xml_str2json(resp);
			callback(productInstance.productInstance);
		}, callbackError);
	};

	var uninstallProductInstance = function (productInstance_id, callback, callbackError, region) {

		check(region);

		sendRequest('DELETE', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		}, callbackError);
	};

	var updateProductInstance = function (productInstance_id, release_id, callback, callbackError, region) {

		check(region);

		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id + '/release/' + release_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		}, callbackError);
	};

	var reconfigureProductInstance = function (productInstance_id, attributes, callback, callbackError, region) {

		check(region);

		var a = {attributes: {attribute: attributes}};
		var xmlAttributes = xmlHead + x2js.json2xml_str(a); 

		//console.log(xmlAttributes);

		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, xmlAttributes, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		}, callbackError);
	};

	//Task Management

	var getTask = function (task_id, callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'vdc/' + vdc_id + '/task/' + task_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		}, callbackError);
	};	

	var getTasks = function (callback, callbackError, region) {

		check(region);

		sendRequest('GET', 'vdc/' + vdc_id + '/task', undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.tasks);
		}, callbackError);
	};	

	// Recipes

	var addRecipe = function (name, version, repo, url, 
								config_management, sos, description, 
								attributes, tcp_ports, udp_ports, dependencies, 
								callback, callbackError, region) {

		check(region, true);

		var data = {recipe: {
			name: name,
			version: version,
			repository: repo,
			url: url,
			config_management: config_management,
			sos: sos,
		}};

		if (description) data.recipe.description = description;
		if (tcp_ports) data.recipe.tcp_ports = tcp_ports;
		if (udp_ports) data.recipe.udp_ports = udp_ports;
		if (dependencies) data.recipe.dependencies = dependencies;
		if (attributes) data.recipe.attr = attributes;

		var xmlTempl = xmlHead + x2js.json2xml_str(data);

		sendRequest('POST', '', xmlTempl, function (resp) {
			callback(resp);
		}, callbackError);
	};

    return {
	    getProductList: getProductList,
	    addProduct: addProduct,
	    getProduct: getProduct,
	    getProductReleases: getProductReleases,
	    deleteProduct: deleteProduct,
	    getProductAttributes: getProductAttributes,
	    installProductInstance: installProductInstance,
	    getProductInstanceList: getProductInstanceList,
	    getProductInstance: getProductInstance,
	    uninstallProductInstance: uninstallProductInstance,
	    updateProductInstance: updateProductInstance,
	    reconfigureProductInstance: reconfigureProductInstance,
	    getTask: getTask, 
	    getTasks: getTasks,
	    addRecipe: addRecipe
    };
    
}(ServiceDC));