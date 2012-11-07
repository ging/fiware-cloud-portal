var CDMI=CDMI||{};CDMI.VERSION="0.1";CDMI.AUTHORS="GING";
CDMI.Rest=function(j,i)
{var f;f=function(g,b,a,c,d,e,k,op,name){
	
	var h,f;h=new XMLHttpRequest;
	var result = h.responseXML;
	h.open(g,b,!0);if(k!=i)
	switch(k)
	{case "container":h.setRequestHeader("Content-Type","application/cdmi-container");
	h.setRequestHeader("Accept","application/json");
	case "object":h.setRequestHeader("Content-Type","application/vnd.org.snia.cdmi.object+json");
	h.setRequestHeader("Accept","application/json", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "image/jpeg");break;
	case "json":h.setRequestHeader("Content-Type","application/vnd.org.snia.cdmi.object+json");
	h.setRequestHeader("Accept","application/vnd.org.snia.cdmi.object+json");
	break;default:h.setRequestHeader("Accept","application/cdmi-object")}
	h.onreadystatechange=function(){if(4===h.readyState)switch(h.status){case 100:
	case 200: 
					//if (op !== undefined) {
					if (op === 'download') {
						console.log(h);
						//console.log(name);
	                    if (h.responseText !== undefined && h.responseText !== '') {
	                    	d(h.responseText);
	                    }	                    
	                    break;                		
                	} 
					
					
	case 202:
	
	case 203:case 204:case 205:f=i;h.responseText!==i&&""!==h.responseText&&(f=JSON.parse(h.responseText));d(f);break;

case 400:e("400 Bad Request");break;

case 201:d(h.status);break;case 401:e("401 Unauthorized");break;

case 403:e("403 Access denied");break;

case 409:console.log(h.status);h.status;break;default:e(h.status+" Error")}};
c!==i&&h.setRequestHeader("X-Auth-Token",c);(a!==i)?(h.send(a)):h.send()};return{get:function(g,b,a,c,d,q){f("GET",g,i,b,a,c,d,q)},post:function(g,b,a,c,d,e){f("POST",g,b,a,c,d,e)},put:function(g,b,a,c,d,e){f("PUT",g,b,a,c,d,e)},del:function(g,b,a,c,d){f("DELETE",g,i,b,a,c,d)}}}(CDMI);
CDMI.Actions=function(j,i){var f,g;f={url:i,state:i,endpointType:"publicURL"};g=function(){if(JSTACK.Keystone!==i&&JSTACK.Keystone.params.currentstate===JSTACK.Keystone.STATES.AUTHENTICATED){var b=JSTACK.Keystone.getservice("object-store");f.url=b.endpoints[0][f.endpointType];return!0}return!1};return{params:f,check:g,getcontainerlist:function(b){var a,c;g()&&(a=function(a){b!==i&&b(a)},c=function(a){throw Error(a);},j.Rest.get(f.url,JSTACK.Keystone.params.token,a,c,"container",undefined, undefined))},createcontainer:function(b,
a){var c,d,e,k;g()&&(c=f.url+"/"+b,k={metadata:{}},d=function(b){a!==i&&a(b)},e=function(a){throw Error(a);},j.Rest.put(c,k,JSTACK.Keystone.params.token,d,e,"container"))},deletecontainer:function(b,a){var c,d,e;g()&&(c=f.url+"/"+b,d=function(b){a!==i&&a(b)},e=function(a){throw Error(a);},j.Rest.del(c,JSTACK.Keystone.params.token,d,e,"container"))},getobjectlist:function(b,a){var c,d,e;g()&&(c=f.url+"/"+b,d=function(b){a!==i&&a(b)},e=function(a){throw Error(a);},j.Rest.get(c,JSTACK.Keystone.params.token,
d,e,"object",undefined,undefined))},uploadobject:function(b,a,c,d){var m,e;g()&&(b=f.url+"/"+b+"/"+a,m=c, a=function(a){d!==i&&d(a)},e=function(a){throw Error(a);},j.Rest.put(b,m,JSTACK.Keystone.params.token,a,e,"object"))},downloadobject:function(b,a,c){var op,d,e;g()&&(d=f.url+"/"+b+"/"+a,a=function(a){c!==i&&c(a)},e=function(a){throw Error(a);},j.Rest.get(d,JSTACK.Keystone.params.token,a,e,"object", "download",a))},copyobject:function(b,a,c){var d,e;g()&&(d=f.url+"/"+a+"/"+b,a=
function(a){c!==i&&c(a)},e=function(a){throw Error(a);},j.Rest.put(d,b,JSTACK.Keystone.params.token,a,e,"object"))},deleteobject:function(b,a,c){var d;g()&&(b=f.url+"/"+b+"/"+a,a=function(a){c!==i&&c(a)},d=function(a){throw Error(a);},j.Rest.del(b,JSTACK.Keystone.params.token,a,d,"container"))}}}(CDMI);