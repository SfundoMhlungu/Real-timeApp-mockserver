import * as http from "http"
import {server as WebSocketServer} from "websocket"
import {fakedata} from "./data.js"
import {startSimulation} from "./simulate.js"
//const WebSocketServer = require("websocket").server
let connection = null
const j_ = JSON.stringify
const jp_ = JSON.parse


function processMsgs(msg){
  try{
     msg = jp_(msg)     
   }catch(err){
    console.log(err)
	  connection.send(j_({type: "expected a stringified object", msg: `got ${msg} instead of a stringified object`}))
    return;
  }

   if(!msg.event){
         connection.send(j_({type: 'no event type', msg: `expected event property on object ${msg}`}))
        return;
   }
   switch(msg.event){

	   case "realtime":
		   try{
 			 startSimulation(connection)
				   //connection.send(j_({type: "realtime", data: d_}))

			}
		    catch(err){
                connection.send(j_({type: "error", msg: `encountered error: ${err} while creating fake data, restart server or debug line 28`}))
			}
		   break;
    default: 
		connection.send(j_({type: "unhandled event", msg: `${msg.event} unknown`}));
		break;
   }

}



// server

const httpServer = http.createServer((req, res)=> {
	console.log("got a request")
    response.writeHead(404);
    response.end();
})



const websocket = new WebSocketServer({
    "httpServer": httpServer
})

websocket.on("request", req=> {
	connection =  req.accept(null, req.origin)
	console.log(connection.connected, connection.state)
   if(connection.connected){

      connection.send(JSON.stringify({type: "opened", msg: "connection opened"}))
   }	
	// connection.on("open", () => console.log("connection opened"))
  connection.on("close",() => console.log("connection closed"))
  connection.on("message",(msg) => processMsgs(msg.utf8Data))

})




httpServer.listen(8080, ()=> console.log("listening @8080"))
