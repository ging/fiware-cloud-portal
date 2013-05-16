var BP = BP || {};

// Current version is **0.1**.

BP.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
BP.AUTHORS = 'GING';

BP.API = (function (_BP, undefined) {

	var x2js;
	var vdc_id;

	var orgName = 'FIWARE';
	var bpUrl = 'http://rosendo.dit.upm.es/paasmanager/rest/';
	//var bpUrl = '/paasmanager/rest/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';


	var check = function () {
		x2js = x2js || new X2JS();
		//vdc_id = vdc_id || JSTACK.Keystone.params.access.token.tenant.id;
		vdc_id = '6571e3422ad84f7d828ce2f30373b3d4';
	}
	
	var sendRequest = function (method, url, body, callback, callbackError) {

		var req = new XMLHttpRequest();
		//var token = JSTACK.Keystone.params.token;
		var token = "501c8708f68642ababaa0b2a1179d9e2";

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

		req.open(method, bpUrl + url, true);

		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('X-Auth-Token', token);
	    req.setRequestHeader('Tenant-ID', vdc_id);
		req.send(body);

	};

	//Blueprint Catalogue

	var getBlueprintList = function (callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/environment', undefined, function (resp) {
			var bpList = x2js.xml_str2json(resp);
			callback(bpList.environmentDtoes.environmentDto_asArray);
		}, callbackError);
	};

	var getBlueprint = function (bp_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/environment/' + bp_id, undefined, function (resp) {
			var bp = x2js.xml_str2json(resp);
			callback(bp.environmentDto);
		}, callbackError);
	};

	var getBlueprintTierList = function (bp_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/environment/' + bp_id + '/tier', undefined, function (resp) {
			var bpt = x2js.xml_str2json(resp);
			callback(bpt.tierDtoes.tierDto_asArray);
		}, callbackError);
	};

	var getBlueprintTier = function (bp_id, tier_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/environment/' + bp_id + '/tier/' + tier_id, undefined, function (resp) {
			var bpt = x2js.xml_str2json(resp);
			callback(bpt.tierDto);
		}, callbackError);
	};


	//Blueprint Templates

	var getBlueprintTemplateList = function (callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment', undefined, function (resp) {
			var bpList = x2js.xml_str2json(resp);
			callback(bpList.environmentDtoes.environmentDto_asArray);
		}, callbackError);
	};

	var getBlueprintTemplate = function (bp_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id, undefined, function (resp) {
			var bp = x2js.xml_str2json(resp);
			callback(bp.environmentDto);
		}, callbackError);
	};

	var createBlueprintTemplate = function (bp, callback, callbackError) {

		check();

		var b = {environmentDto: bp};

		var xmlTempl = xmlHead + x2js.json2xml_str(b);

		console.log('creo', xmlTempl);

		sendRequest('POST', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment', xmlTempl, callback, callbackError);

	};

	var deleteBlueprintTemplate = function (bp_id, callback, callbackError) {

		check();

		sendRequest('DELETE', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id, undefined, function (resp) {
			callback(resp);
		}, callbackError);
	};

	var getBlueprintTemplateTierList = function (bp_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id + '/tier', undefined, function (resp) {
			var bpt = x2js.xml_str2json(resp);
			callback(bpt.tierDtoes.tierDto_asArray);
		}, callbackError);
	};

	var getBlueprintTemplateTier = function (bp_id, tier_id, callback, callbackError) {

		check();

		sendRequest('GET', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id + '/tier/' + tier_id, undefined, function (resp) {
			var bpt = x2js.xml_str2json(resp);
			callback(bpt.tierDto);
		}, callbackError);
	};



	//Blueprint Instances


	var getBlueprintInstanceList = function (callback, callbackError) {

		check();

		sendRequest('GET', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance', undefined, function (resp) {
			var bpList = x2js.xml_str2json(resp);
			callback(bpList.environmentInstanceDtoes);
		}, callbackError);
	};

	var getBlueprintInstance = function (bp_id, callback, callbackError) {

		check();

		sendRequest('GET', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance/' + bp_id, undefined, function (resp) {
			var bp = x2js.xml_str2json(resp);
			callback(bp);
		}, callbackError);
	};

	var launchBlueprintInstance = function (bp, callback, callbackError) {

		check();

		var b = {environmentInstanceDto: bp};

		var xmlInst = xmlHead + x2js.json2xml_str(b);

		sendRequest('POST', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance', xmlInst, callback, callbackError);
	};

	var stopBlueprintInstance = function (bp_id, callback, callbackError) {

		check();

		sendRequest('DELETE', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance/' + bp_id, undefined, function (resp) {
			callback(resp);
		}, callbackError);
	};













	//Task Management

	var getTask = function (task_id, callback, callbackError) {

		check();

		sendRequest('GET', 'vdc/' + vdc_id + '/task/' + task_id, undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.task);
		}, callbackError);
	};	

	var getTasks = function (callback, callbackError) {

		check();

		sendRequest('GET', 'vdc/' + vdc_id + '/task', undefined, function (resp) {
			var task = x2js.xml_str2json(resp);
			callback(task.tasks);
		}, callbackError);
	};	

    return {
	    getBlueprintList: getBlueprintList,
	    getBlueprint: getBlueprint,
	    getBlueprintTierList: getBlueprintTierList,
	    getBlueprintTier: getBlueprintTier,
	    getBlueprintTemplateList: getBlueprintTemplateList,
	    getBlueprintTemplate: getBlueprintTemplate,
	    createBlueprintTemplate: createBlueprintTemplate,
	    deleteBlueprintTemplate: deleteBlueprintTemplate,
	    getBlueprintTemplateTierList: getBlueprintTemplateTierList,
	    getBlueprintTemplateTier: getBlueprintTemplateTier,
	    getBlueprintInstanceList: getBlueprintInstanceList,
	    getBlueprintInstance: getBlueprintInstance,






	    getTask: getTask, 
	    getTasks: getTasks
    };
    
}(BP));