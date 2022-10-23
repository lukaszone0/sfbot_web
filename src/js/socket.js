'use strict';



export class Socket{
	constructor(addr){
		this.botaddr = addr;
	}

	updatecryptokeys(cid, ck){
		this.cryptoid = cid;
		this.cryptokey = ck;
	}

	send(req, callback){
		
        var url = "http://192.168.8.189/botapi/?oko=" + JSON.stringify(req);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {

                if (this.readyState == 4 && this.status == 200) {
                    var ret = JSON.parse('{"message":"server error","requeststatus":"error"}');
                    try {
                        var ret = JSON.parse(this.responseText);
                    }
                    catch(e){
                        //todo
                        console.log("json parse exception");
                    }

                    callback(ret, req.act);
                }
                else if(this.status > 300){
                    var ret = JSON.parse('{"message":"server error status'+ this.status +'","requeststatus":"error"}');
                    callback(ret, req.act);
                }
                
            };

            xmlhttp.open("GET", url, true);
            xmlhttp.send();
	}
}