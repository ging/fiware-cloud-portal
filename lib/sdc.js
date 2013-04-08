var ServiceDC = ServiceDC || {};

// Current version is **0.1**.

ServiceDC.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
ServiceDC.AUTHORS = 'GING';

ServiceDC.API = (function (_ServiceDC, undefined) {

	var x2js = new X2JS();
	//var sdcUrl = 'http://130.206.80.112:8080/sdc/rest/';
	var sdcUrl = 'http://130.206.80.93/sdc/rest/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
	
	var sendRequest = function (method, url, body, callback) {

		var req = new XMLHttpRequest();
		var token = JSTACK.Keystone.params.token;

		req.onreadystatechange = onreadystatechange = function () {

	  		if (req.readyState == '4') {
	    		//console.log('Respuesta: ', req.responseText);
	    		callback(req.responseText);
	    	}
		}

		req.open(method, sdcUrl + url, true);

		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('X-Auth-Token', token);
		req.send(body);

	};

	//Product Catalogue

	var getProductList = function (callback) {

		sendRequest('GET', 'catalog/product', undefined, function (resp) {
			var productList = x2js.xml_str2json(resp);
			callback(productList.products);
		});
	};

	var addProduct = function (name, description, attributes, callback) {

		//attributes: array of jsons
		var p = {product: {name: name, description: description, attributes: attributes}};
		var xmlProduct = xmlHead + x2js.json2xml_str(p);

		sendRequest('POST', 'catalog/product', xmlProduct, function (resp) {
			callback(resp);
		});
	};

	var getProduct = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id, undefined, function (resp) {
			var product = x2js.xml_str2json(resp);
			callback(product.product);
		});
	};

	var getProductReleases = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id + '/release', undefined, function (resp) {
			var productReleases = x2js.xml_str2json(resp);
			callback(productReleases.productReleases);
		});
	};

	var deleteProduct = function (product_id, callback) {

		sendRequest('DELETE', 'catalog/product/' + product_id, undefined, function (resp) {
			callback();
		});
	};

	var getProductAttributes = function (product_id, callback) {

		sendRequest('GET', 'catalog/product/' + product_id + '/attributes', undefined, function (resp) {
			var attributes = x2js.xml_str2json(resp);
			callback(attributes.attributes);
		});
	};

	//Product Provisioning

	var installProductInstance = function (vdc_id, ip, fqn, osType, hostname, product, callback) {

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

	var getProductInstanceList = function (vdc_id, callback) {

		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance', undefined, function (resp) {
			var productInstances = x2js.xml_str2json(resp);
			callback(productInstances.productInstances);
		});
	};

	var getProductInstance = function (vdc_id, productInstance_id, callback) {
		sendRequest('GET', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var productInstance = x2js.xml_str2json(resp);
			callback(productInstance.productInstance);
		});
	};

	var uninstallProductInstanceVersion = function (vdc_id, productInstance_id, callback) {
		sendRequest('DELETE', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	var updateProductInstance = function (vdc_id, productInstance_id, release_id, callback) {
		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id + '/release/' + release_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	var reconfigureProductInstance = function (vdc_id, productInstance_id, attributes, callback) {

		var a = {attributes: attributes};
		var xmlAttributes = xmlHead + x2js.json2xml_str(a); 

		sendRequest('PUT', 'vdc/' + vdc_id + '/productInstance/' + productInstance_id, xmlAttributes, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
	};

	//Task Management

	var getTask = function (vdc_id, task_id, callback) {
		sendRequest('GET', 'vdc/' + vdc_id + '/task/' + task_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		});
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
	    uninstallProductInstanceVersion: uninstallProductInstanceVersion,
	    updateProductInstance: updateProductInstance,
	    reconfigureProductInstance: reconfigureProductInstance,
	    getTask: getTask
    };
    
}(ServiceDC));