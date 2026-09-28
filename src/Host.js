import {useEffect,useState,useRef} from 'react';
import { useWebSocket,ws } from 'react-use-websocket/dist/lib/use-websocket.js';
import MobileCanvas from './mobilecanvaspage.js';
//import MobileCanvas from "./mobilecanvaspage.js";

/*
The host can see all and gets reall time updates to each canvas they see
we need to make a canvas page each time someone joins
*/

function Host(){
    const username = 'RAQ'
    const [newmsg,setMsg] = useState("");
    const [users,setUsers] = useState([]);//for rendering
    const pages = [];
    var i = 0;
    const [canvasPageData,setCanvasPageData] = useState("");
    const [canvasPages,setCanvasList] = useState([]);
    const [currentUsers,setCurrentUsers] = useState([]);

    
    const WS_URL = 'ws://localhost:8080'
    const data = useWebSocket(WS_URL,{
        queryParams:{username},
        onMessage(ws,event){
            parseMessage(ws.data);

        },
        shouldReconnect: (closeEvent) => true,

    
    });
    //const getDrawingMessage = useRef(sendJsonMessage);
   //add a user 
    //add a canvas page
    const addUser = (uuid,username) => {
        setUsers([...users,[uuid,username]])
        //users[uuid] = username;
        canvasPages[uuid] = null;
    }

    function removeUser(uuid){
        setUsers((users) => users.filter(user=>user[0] !== uuid));
    }
    const parseMessage = (message) => {
        const msg = JSON.parse(message);
        //console.log("parsed",msg); 
        newUser(msg);
        
    }
    //tokenize new user string
    //adduser
    const  newUser = (newUser) => {
        if(typeof newUser === 'string'){
            const userAlert = newUser.split(':');
            userAlert[0] = userAlert[0].replace(/^\"+|\"+$/g, '');
            userAlert[2] = userAlert[2].replace(/^\"+|\"+$/g, '');
            if(userAlert[0] == "NewUser"){
                addUser(userAlert[1],userAlert[2])//uuid,username
            }
            if(userAlert[0]== "Disconnect"){
                removeUser(userAlert[1]);
            }
        }
        
        //return(ComponentContainer());
        
    }
    function CanvasMimic(props){
        return(
            <div>
            <h1>User</h1>
            <p>{props[0]}</p>
            <p>{props[1]}</p>
            </div>
        );
    }
    return(
            users.map((user,index) => (
                <CanvasMimic key={index} {...user}/>
            ))
    )
    
    
}
export default Host;