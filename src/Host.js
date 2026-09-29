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
    const [contexRef,setContextRefList] = useState([]);
    const [canvasPageRef,setCanvasRefsList] = useState([]);

    
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
        const canvasPgRef = null;
        setCanvasRefsList([...canvasPageRef,[uuid,canvasPgRef,[]]])//uuid canvas refrence canvas history
        setContextRefList([...contexRef,[uuid,contexRef,[]]])
    }

    const removeUser = (uuid) => {
        setUsers((users) => users.filter(user => user[0] !== uuid));
        setCanvasRefsList((canvasPageRef) => canvasPageRef.filter(refs => refs[0] !== uuid))
        setContextRefList((contexRef) => contexRef.filter(refs => refs[0] !== uuid ))
    }
    const parseMessage = (message) => {
        const msg = JSON.parse(message);
        console.log("parsed",msg); 
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
            else if(userAlert[0]== "Disconnect"){
                removeUser(userAlert[1]);
            }
        }
        else{
            const uuid = Object.keys(newUser)[0];
            const username = newUser[uuid].username;
            const lastmovements = newUser[uuid].state.message;
            console.log(uuid,username)
            console.log(lastmovements);
        }
        
        //return(ComponentContainer());
        
    }
    const newData = (msg) => {
        console.log("other data",msg);
    }
    function CanvasMimic(props){
        return(
            <div>
            <h1>User</h1>
            <p>{props[0]}</p>
            <p>{props[1]}</p>
            <UsersCanvas/>
            </div>
        );
    }
    function UsersCanvas(uuid,canvas,contextReference){
        const contextRef = useRef(contextReference)
        const width = 500
        const height = 500
        const canvasRef = useRef(canvas);

        const drawMessage = () => {
            //console.log(uuid,canvas,contextRef);
        }

        useEffect (() => {
            const canvas = canvasRef.current;
            canvas.width = width;
            canvas.height = height;
    
            const context = canvas.getContext("2d");
            context.lineCap = "round";
            context.strokeStyle = "black";
            context.lineWidth = 5;
            contextRef.current = context;
            
        },[]);
        return(
            <div >
                <canvas 
                className={"player"}
                ref={canvasRef}
                id={uuid}
                onMessage={drawMessage()}
                style={{border : "5px solid black"}}
                />
            </div>
        )

    }
    return(
            users.map((user,index) => (
                <CanvasMimic key={index} {...user}/>
            ))
    )
    
    
}
/**
 * CanvasRef Stucture
 * UUID = str
 * CanvasRef = OBJ
 * CanvasHistory = []
 */
export default Host;