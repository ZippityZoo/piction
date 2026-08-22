import {useEffect} from 'react';

function Host(){
    useEffect(() =>{
        //ip 192.168.1.124
        const ws = new WebSocket('wss://localhost:3001');
        console.log("Initial state:", ws.readyState)
        ws.onopen = (event) =>{
            console.log('ws opened');
            console.log("Code:", event.code);
            console.log("Reason:", event.reason);
            console.log("Was clean:", event.wasClean);
            console.log();
        }
        ws.onerror = (event) => {
            console.error("WebSocket error:", event);
          };
        ws.onclose = (event) => {
            console.log("WebSocket closed");
            console.log("Code:", event.code);
            console.log("Reason:", event.reason);
            console.log("Was clean:", event.wasClean);
            console.log();
        };
        console.log("Initial state:", ws.readyState);
    });

}
/*
function Client(){
    useEffect(() =>{
        const ws = new WebSocket('wss://192.168.1.124:3000');
        ws.onopen = () => console.log('ws opened');
        ws.send =() =>{
            console.log("Yo mama");
        }
        ws.onclose = () => console.log('ws closed');
        
    });
}
*/
export default Host;
