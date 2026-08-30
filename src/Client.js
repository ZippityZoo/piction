import {useEffect} from 'react';
import MobileCanvas from './mobilecanvaspage.js';
import useWebsocket from 'react-use-websocket';


function Client(){
    const WS_URL = 'ws://localhost:8080'
    const {sendJsonMessage} = useWebsocket(WS_URL,{
        queryParams:{username}
    })
    var username;
    useEffect(() =>{
        //ip 192.168.1.124
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            console.log('ws opened');
        }  
        ws.send = () =>{
            console.log("Yo mama");
        }
        //notifies when the server shuts down
        ws.onclose = () => {
            console.log('ws closed');
        }

    });
    return(
        <MobileCanvas/>
    );
}

export default Client;
