import {useEffect,useState,useRef} from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js';
import MobileCanvas from './mobilecanvaspage.js';
//import MobileCanvas from "./mobilecanvaspage.js";

/*
The host can see all and gets reall time updates to each canvas they see
we need to make a canvas page each time someone joins
*/

function Host(){
    const username = 'RAQ'
    const users = [];
    const pages = [];
    const [canvasPageData,setCanvasPageData] = useState("");

    
    const WS_URL = 'ws://localhost:8080'
    const {sendJsonMessage} = useWebSocket(WS_URL,{
        queryParams:{username}
    });
    const getDrawingMessage = useRef(sendJsonMessage);
    onmessage = function(drawUpdate){
        console.log(drawUpdate);
    }
    
    useEffect(() =>{
        getDrawingMessage.current({
            message:canvasPageData
    },[canvasPageData]);
    
},[canvasPageData]);
    
    return(
        <CanvasMimmic/>
    );
}
//mimmics the canvas elements
function CanvasMimmic(){
    <canvas 
            className={"player"}
            id={"cv"}
            style={{border : "5px solid black"}}
            />
}
export default Host;