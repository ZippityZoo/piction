import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';
import {v4 as uuidv4} from 'uuid';
const port = 8080;
const server  = http.createServer();
const wss =  new WebSocketServer({server});
const connections = {};//alot of extra metadata
const users = {};//for our own user data

//come back to this 
const handleDrawing = (bytes,uuid) => {
    const drawData = JSON.parse(bytes.toString());
    console.log(drawData);

    //draw data , we want live drawings on our main page
    broadcast();
};

const handleClose = (uuid) => {

    console.log(`${users[uuid]} disconnected`)
    delete connections[uuid];
    delete users[uuid];

    broadcast();

}

const broadcast = () => {
    Object.keys(connections).forEach(uuid =>{
        const connection = connections[uuid];
        const data = JSON.stringify(users);
        connection.send(data);
    });
}

server.listen(port, () =>{
    console.log(`Server listening on port ${port}`);
})
wss.on("connection", (connection, request) => {
    const {hostlink} = url.parse(request.url,true).query;
    const uuid = uuidv4();
    console.log(uuid);
    
    connections[uuid] = connection;
    users[uuid] = {
        state: {
            touchEvent:true,
            x:0,
            y:0,
            canvasRef:null
        }
    }
    connection.on("draw", draw => handleDrawing(drawData,uuid));
    connection.on("close", () => handleClose(uuid));

})


/*


wss.on("connection",function connection(ws){
    ws.on('message',function data(data){
        console.log("recived %s ",data);
    });
    ws.send("connection recived");
    ws.on('close', function close(){
        ws.send("you've been terminated");
        console.log('connection terminated');
        //we 
    });

});
*/