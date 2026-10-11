import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';
import {v4 as uuidv4} from 'uuid';
const port = 8080;
const server  = http.createServer();
const wss =  new WebSocketServer({server});
const connections = {};//alot of extra metadata
const users = {};//for our own user data
const usersCanvas = {};
const hostConnection = {};//holds host id
const connectionsToSend = {}//queue of newly connected clients when the hos is not active
var hostID;
var hostConnected = false;
//come back to this 
const handleDrawing = (bytes,uuid) => {
    if(uuid != hostID){
        const drawData = JSON.parse(bytes.toString());
        const user = users[uuid];
        user.state = drawData;
    }
    //usersCanvas[uuid].push(drawData);
    
    //draw data , we want live drawings on our main page
    broadcast();
};

const handleClose = uuid => {
    if(uuid === hostID){
        console.log(`Host disconnected`);
        delete hostConnection[0];
        hostID = null;
        hostConnected = false
    }else{
        console.log(`${users[uuid].username} disconnected`);
        delete connections[uuid];
        delete users[uuid];
    }
    broadcast();

}

const broadcast = () => {
    Object.keys(connections).forEach(uuid =>{
        const connection = connections[uuid];
        const data = JSON.stringify(users);
        const drawingData = JSON.stringify(usersCanvas[uuid].state)
        if(hostConnected){
            hostConnection[0].send(data);
        }

        connection.send(drawingData);
        
    });


}

server.listen(port, () =>{
    console.log(`Server listening on port ${port}`);
})


wss.on("connection", (connection, request) =>  {
    const {username} = url.parse(request.url,true).query;
    const uuid = uuidv4();
    if(username != 'RAQ'){
        initUser(connection,username,uuid);
    }else if(username == 'RAQ'){
        initHost(connection,username,uuid); 
    }
    
    //connection.on("message", draw => handleDrawing(draw,uuid));
    


})

async function initUser(connection,username,uuid){
    await isHostConnected(() => hostConnected === true);
    console.log(`${username} connected`);
    sendHostJoinMsg(uuid,username);
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
    connection.on("message", draw => handleDrawing(draw,uuid));
    connection.on("close", () =>{
        sendHostDisconnectMsg(uuid);
        handleClose(uuid)
    });
}

async function initHost(connection,username,uuid){
    if(hostConnected){
        return;
    }
    console.log(`Host connected`);
    hostID = uuid;
    hostConnection[0] = connection
    hostConnected = true;
    connection.on("close", () => {
        handleClose(uuid)
        
    });
}

async function isHostConnected(){
    return new Promise ((resolve) => {
        if(hostConnected){
            resolve();
        }
    });
}

function sendHostJoinMsg(uuid,username){
    const newuser = JSON.stringify("NewUser:"+uuid+":"+username);
    
    hostConnection[0].send(newuser);

}
function sendHostDisconnectMsg(uuid,username){
    if(hostConnected){
        const user = JSON.stringify("Disconnect:"+uuid+":"+username);
        hostConnection[0].send(user);
    }
}

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