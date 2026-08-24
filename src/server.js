import WebSocket, { WebSocketServer } from 'ws';
const wss =  new WebSocketServer({
    port:8080
});
wss.on("connection",function connection(wss){
    wss.on('message',function data(data){
        console.log("recived %s ",data);
    });
    wss.send("connection recived");
    wss.on('close', function close(){
        console.log('connection terminated');
    });
});