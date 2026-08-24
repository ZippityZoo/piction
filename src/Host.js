import {useEffect} from 'react';

function Host(){
    useEffect(() =>{
        //ip 192.168.1.124
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => console.log('ws opened');
        console.log("Initial state:", ws.readyState);
        ws.send =() =>{
            console.log("Yo mama");
        }
        ws.onclose = () => console.log('ws closed');
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
