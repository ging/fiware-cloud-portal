
var SDC = function (spec) {

	var that = {};

	var x2js = new X2JS();
	//var sdcUrl = 'http://130.206.80.112:8080/sdc/rest/';
	var sdcUrl = 'http://130.206.80.93/sdc/rest/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
	
	var sendRequest = function (method, url, body, callback) {

		var req = new XMLHttpRequest();

		req.onreadystatechange = onreadystatechange = function () {

	  		if (req.readyState == '4') {
	    		//console.log('Respuesta: ', req.responseText);
	    		callback(req.responseText);
	    	}
		}

		req.open(method, sdcUrl + url, true);

		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('X-Auth-Token', 'eaaafd18-0fed-4b3a-81b4-663c99ec1cbb');
		req.send(body);

	};

	//Product Catalogue

	that.getProductList = function (callback) {

		sendRequest('GET', 'catalog/product', undefined, function (resp) {
			var productList = x2js.xml_str2json(resp);
			callback(productList.products);
		});
	};

	that.addProduct = function (name, description, attributes, callback) {

		//attributes: array of jsons
		var p = {product: {name: name, description: description, attributes: attributes}};
		var xmlProduct = xmlHead + x2js.json2xml_str(p);

		sendRequest('POST', 'catalog/product', xmlProduct, function (resp) {
			callback(resp);
		});
	};

	that.getProduct = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id, undefined, function (resp) {
			var product = x2js.xml_str2json(resp);
			callback(product.product);
		});
	};

	that.getProductReleases = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id + '/release', undefined, function (resp) {
			var productReleases = x2js.xml_str2json(resp);
			callback(productReleases.productReleases);
		});
	};

	that.deleteProduct = function (product_id, callback) {

		sendRequest('DELETE', 'catalog/product/' + product_id, undefined, function (resp) {
			callback();
		});
	};

	that.getProductAttributes = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id + '/attributes', undefined, function (resp) {
			var attributes = x2js.xml_str2json(resp);
			callback(attributes.attributes);
		});
	};

	//Product Provisioning

	that.installProductInstance = function (vdc_id, ip, fqn, osType, hostname, product, callback) {

		// osType
		// 94 ubuntu
		// 76 centos

		var i = {productInstanceDto: {vm: {ip: ip, fqn: fqn, osType: osType, hostname: hostname}, product: product}};
		var xmlInstance = xmlHead + x2js.json2xml_str(i);

		console.log(xmlInstance);

		sendRequest('POST', 'vdc/' + vdc_id + '/productInstance', xmlInstance, function (resp) {
			callback();
		});
	};

	that.getProductInstanceList = function (vdc_id, callback) {

		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance', undefined, function (resp) {
			var productInstances = x2js.xml_str2json(resp);
			callback(productInstances.productInstances);
		});
	};

	that.getProductInstance = function (vdc_id, productInstance_id, callback) {
		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var productInstance = x2js.xml_str2json(resp);
			callback(productInstance.productInstance);
		});
	};

	that.uninstallProductInstanceVersion = function (vdc_id, productInstance_id, callback) {
		sendRequest('DELETE', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	that.updateProductInstance = function (vdc_id, productInstance_id, release_id, callback) {
		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id + '/release/' + release_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	that.reconfigureProductInstance = function (vdc_id, productInstance_id, attributes, callback) {

		var a = {attributes: attributes};
		var xmlAttributes = xmlHead + x2js.json2xml_str(a); 

		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, xmlAttributes, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	//Task Management

	that.getTask = function (vdc_id, task_id, callback) {
		sendRequest('GET', 'vdc/' + vdc_id + '/task/' + task_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};	

	return that;
};
