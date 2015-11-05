var Sanity = Sanity || {};

// Current version is **0.1**.

Sanity.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
Sanity.AUTHORS = 'GING';

Sanity.API = (function (_Sanity, undefined) {

	var x2js = new X2JS();;

	var sanity_url = '/NGSI10/queryContext';
	
	var sendRequest = function (method, body, callback, callbackError) {

		var req = new XMLHttpRequest();
	
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

		req.open(method, sanity_url, true);
		
		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/json');
		req.send(body);

	};

	var getNodeStatus = function (region, callback, callbackError) {

		//check(region);

		var body = '{"entities": [{ "type": "region", "isPattern": "false", "id": "' + region + '" }],"attributes": ["sanity_status"]}';

		sendRequest('POST', body, function (resp) {

			var json = x2js.xml_str2json(resp);

			var status = json.queryContextResponse.contextResponseList.contextElementResponse.contextElement.contextAttributeList.contextAttribute.contextValue;
			//console.log('status: ', status);
			callback(region, status);
		}, callbackError);
	};

    return {
	    getNodeStatus: getNodeStatus
    };
    
}(Sanity));