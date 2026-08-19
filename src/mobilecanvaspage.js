import { useEffect, useRef } from "react";
import { useState } from "react";
import './App.css';

function MobileCanvas(){
    const canvasRefrence = useRef(null);
    const contextRefrence = useRef(null);
    const [isPressed,setIsPresssed] = useState(false);
    const width = 400;
    const height = 700;
    const beginDraw = (event) => {
        const touchEvent = event.targetTouches[0]
        contextRefrence.current.beginPath();
        contextRefrence.current.moveTo(touchEvent.clientX,touchEvent.clientY);
        setIsPresssed(true);
        
    };
    const moveDraw = (event) => {
        const touchEvent = event.targetTouches[0]
        console.log("O");
        if(!isPressed){
            return;
        }
        contextRefrence.current.lineTo(touchEvent.clientX,touchEvent.clientY);
        contextRefrence.current.stroke();
    };
    const endDraw = () => {
        console.log("D");
        contextRefrence.current.closePath();
        setIsPresssed(false);
        
    };
    useEffect(() => {
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