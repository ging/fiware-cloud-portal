var Monitoring = Monitoring || {};

// Current version is **0.1**.

Monitoring.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
Monitoring.AUTHORS = 'GING';

Monitoring.API = (function (_Monitoring, undefined) {

	var x2js;
	var vdc_id;

	var sdcUrl = '/monitoring/regions/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';


	var check = function (region) {
		x2js = x2js || new X2JS();
		vdc_id = vdc_id || JSTACK.Keystone.params.access.token.tenant.id;
		var def = '/monitoring/regions/';

		if (UTILS.Auth.getRegions().indexOf(region) !== -1) {
			sdcUrl = region + def + region;
		} else {
			sdcUrl = UTILS.Auth.getRegions()[0] + def + UTILS.Auth.getRegions()[0];
		}
	}
	
	var sendRequest = function (method, url, body, callback, callbackError) {

		var req = new XMLHttpRequest();
		var token = Encoder.Base64.encodeBase64(UTILS.Auth.getAccessToken());

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
	    req.setRequestHeader('Authorization', 'Bearer ' + token);
		req.send(body);

	};

	var getVMmeasures = function (id, callback, callbackError, region) {

		check(region);

		// http://193.205.211.69:1336/monitoring/regions/Trento/vms/193.205.211.66


		sendRequest('GET', '/vms/' + id, undefined, function (resp) {
			// var resp = {
			//     "_links": {
			//         "self": { "href": "/monitoring/regions/Trento/hosts/12345/vms/54321" },
			//         "services": { "href": "/monitoring/regions/Trento/vms/54321/services" }
			//     },
			//     "regionid": "Trento",
			//     "vmid": "54321",
			//     "ipAddresses": [
			//             {
			//                "ipAddress": "1.2.3.4"
			//             }
			//         ],
			//     "measures": [
			//         {
			//             "timestamp" : "2013-12-20 12.00",
			//             "percCPULoad": {
			//                 "value": "90",
			//                 "description": "desc"
			//                 },
			//             "percRAMUsed": {
			//                 "value": "500",
			//                 "description": "desc"
			//                 },
			//             "percDiskUsed": {
			//                 "value": "100",
			//                 "description": "desc"
			//                 },
			//             "sysUptime": {
			//                 "value": "123",
			//                 "description": "desc"
			//                 }
			//             }
			//         ],    
			//     "traps": [
			//         {
			//             "description": "desc"
			//         }
			//     ]    
			// };
			callback(JSON.parse(resp).measures);
		}, callbackError);
	};

    return {
	    getVMmeasures: getVMmeasures,
    };
    
}(Monitoring));