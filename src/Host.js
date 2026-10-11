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
    const paghist = [];
    const [users,setUsers] = useState([]);//for rendering
    var i = 0;
    const [contextRef,setContextRefList] = useState([]);
    const [canvasPageRef,setCanvasRefsList] = useState([]);
    const width = 485;
    const height = 825;
    
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
        setContextRefList([...contextRef,[uuid,contextRef,[]]])
    }

    const removeUser = (uuid) => {
        setUsers((users) => users.filter(user => user[0] !== uuid));
        setCanvasRefsList((canvasPageRef) => canvasPageRef.filter(refs => refs[0] !== uuid))
        setContextRefList((contextRef) => contextRef.filter(refs => refs[0] !== uuid ))
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
            setMsg([...newmsg,[uuid,username,lastmovements]]);
            paghist[uuid] = lastmovements;
            //console.log(uuid,username)
            //console.log(lastmovements);
        }
        
        //return(ComponentContainer());
        
    }
    function canvasDraw(pathData,contextReference) {
        if(pathData){
            contextReference.beginPath();
            contextReference.moveTo(pathData[0][0],pathData[0][1]);
            pathData.forEach(vertex => {
                try{
                console.log("path Data", vertex.moving," ",vertex.moving)
                contextReference.lineTo(vertex.moving[0],vertex.moving[1]);
                }catch(e){
                    console.log(e);
                }
            });
            contextReference.closePath();
            contextReference.stroke();
        }   
    }
    function CanvasMimic(props){
        return(
            <div>
            <h1>User</h1>
            <p>{props[0]}</p>
            <p>{props[1]}</p>
            <UsersCanvas uuid={props[0]}/>
            </div>
        );
    }

    function UsersCanvas(uuid){

        //const userContextRef = useRef(contextReference)
        const canvasRef = useRef(null);
        var userContextRef
        
        const draw = () => {
            
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

        useEffect(() => {
            if(canvasRef.current){
                const canvas = canvasRef.current;
                userContextRef = canvasRef.current.getContext("2d");
                if(newmsg){
                    if(newmsg[newmsg.length-1].length > 2){
                        const drawPath = newmsg.at(newmsg.length-1)[2]
                        canvasDraw(drawPath,userContextRef)
                    }
                }
            }
        //console.log(uuid,canvas,contextRef);
        //() => draw(userContextRef))
        })
        

        
        return(
            <div >
                <canvas 
                className={"player"}
                ref={canvasRef}
                id={uuid}
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
 * I did remove clear rect before stuff
 */
export default Host;