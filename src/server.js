import WebSocket, { WebSocketServer } from 'ws';
import {Server} from "socket.io"
import http from 'http';
import url from 'url';
import {v4 as uuidv4} from 'uuid';
import { Socket } from 'dgram';
const port = 8080;
const server  = http.createServer();
const wss =  new WebSocketServer({server});
const connections = {};//alot of extra metadata
const users = {};//for our own user data
const usersCanvas = {};
const hostConnection = {};//holds host id
var hostID;
var hostConnected = false;
//come back to this 
const handleDrawing = (bytes,uuid) => {
    if(uuid != hostID){
        console.log("Start Handle drawing");
        const drawData = JSON.parse(bytes.toString());
        const user = users[uuid];
        user.state = drawData;
        //console.log(drawData);
        console.log("end Handle drawing");
    }
    //usersCanvas[uuid].push(drawData);

    //draw data , we want live drawings on our main page
    broadcast();
};

const handleClose = uuid => {
    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid];
    delete users[uuid];

    broadcast();

}

const broadcast = () => {
    Object.keys(connections).forEach(uuid =>{
        const connection = connections[uuid];
        const data = JSON.stringify(users);
        const drawingData = JSON.stringify(usersCanvas[uuid].state)
        if(hostConnected){
            console.log("start host send");
            hostConnection[0].send(data);
            console.log("end host send");
        }

        connection.send(drawingData);
        
    });


}

server.listen(port, () =>{
    console.log(`Server listening on port ${port}`);
})
wss.on("connection", (connection, request) => {
    const {username} = url.parse(request.url,true).query;
    const uuid = uuidv4();
    if(username != 'RAQ'){
        console.log(`${username} connected`);
        connections[uuid] = connection;
        users[uuid] = {
            username:username,
            state: {
                canvasData:null,
            }
        }
        usersCanvas[uuid] = {
            moving: {
                x:0,
                y:0
            }
        }
    }else{
        console.log(`Host connected`);
        hostID = uuid;
        hostConnection[0] = connection
        hostConnected = true;
    }
    
    connection.on("message", draw => handleDrawing(draw,uuid));
    connection.on("close", () => handleClose(uuid));


})


/*
connection.on("foo", foo => handleFoo(fooData,uuid));

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