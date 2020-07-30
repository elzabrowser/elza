async function getICEServers (){
  console.log("fetching ice servers")
  let o = {
    format: "urls"
  };
  let ice= {}
  
  let bodyString = JSON.stringify(o);
  let https = require("https");
  let options = {
    host: "global.xirsys.net",
    path: "/_turn/MyFirstApp",
    method: "PUT",
    headers: {
        "Authorization": "Basic " + Buffer.from("elza:228be9ce-d1a9-11ea-a532-0242ac150003").toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length
    }
  };
  let httpreq = await https.request(options, function(httpres) {
    let str = "";
    httpres.on("data", function(data){ str += data; });
    httpres.on("error", function(e){ console.log("error: ",e); });
    httpres.on("end", function(){ 
      ice = JSON.parse(str)
    });
  });
  httpreq.on("error", function(e){ console.log("request error: ",e); });
  httpreq.end();
}
export default getICEServers