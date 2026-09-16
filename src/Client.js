import {useEffect,useState,useRef} from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js';
import MobileCanvas from './mobilecanvaspage.js';
//import {io} from 'socket.io-client';

//const event = new Event('draw');

function Client({username}){
    const [canvasPageData,setCanvasPageData] = useState("");
    const sendPageData = (clientData) => {
        //client data is right and not empty same with canvasPageData

        setCanvasPageData(clientData);
        
    }
    const WS_URL = 'ws://localhost:8080'
    const {sendJsonMessage} = useWebSocket(WS_URL,{
        queryParams:{username}
    });
    const sendDrawingJsonMessage = useRef(sendJsonMessage);
    
    useEffect(() =>{
            sendDrawingJsonMessage.current({
                message:canvasPageData
            });
        
    },[canvasPageData]);
    return(
        <MobileCanvas drawData={sendPageData}/>
    );
}

export default Client;
