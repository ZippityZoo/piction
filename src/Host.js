import { useEffect } from "react";
//import MobileCanvas from "./mobilecanvaspage.js";

/*
The host can see all and gets reall time updates to each canvas they see
we need to make a canvas page each time someone joins
*/
function Host(){
    useEffect(() =>{
        //ip 192.168.1.124
        const ws = new WebSocket('ws://localhost:8080');
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

}

export default Host;