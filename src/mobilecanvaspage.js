import { useEffect, useRef } from "react";
import { useState } from "react";
import './App.css';
//Fix refresh on drag down
//fix size to be right
function MobileCanvas(){
    const canvasRefrence = useRef(null);
    const contextRefrence = useRef(null);
    const [isPressed,setIsPresssed] = useState(false);
    const width = 485;
    const height = 825;
    
    const beginDraw = (event) => {
        const touchEvent = event.targetTouches[0]
        contextRefrence.current.beginPath();
        contextRefrence.current.moveTo(touchEvent.clientX,touchEvent.clientY);
        setIsPresssed(true);
        console.log(event);
    };
    const moveDraw = (event) => {
        const touchEvent = event.targetTouches[0]
        if(!isPressed){
            return;
        }
        contextRefrence.current.lineTo(touchEvent.clientX,touchEvent.clientY);
        contextRefrence.current.stroke();
    };
    const endDraw = () => {
        contextRefrence.current.closePath();
        setIsPresssed(false);
        
    };
    useEffect(() => {
        document.body.style.overflow = "hidden"
        const handleOutsideEvent  = (touchEvent) => {
            if(canvasRefrence.current && !canvasRefrence.current.contains(touchEvent.target)){
                    endDraw();
            }
        }
        document.addEventListener("touchmove", handleOutsideEvent);
            return () => {
            document.removeEventListener("touchmove", handleOutsideEvent);
        };
    },[canvasRefrence]);
    
    useEffect (() => {
        const canvas = canvasRefrence.current;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRefrence.current = context;
    },[]);
    return(
        <div >
            <canvas 
            className={"player"}
            ref={canvasRefrence}
            onTouchStart={beginDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
            style={{border : "5px solid black"}}
            />
        </div>
        
    )
}

export default MobileCanvas;