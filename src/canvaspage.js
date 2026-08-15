import { useEffect, useRef } from "react";
import { useState } from "react";

function Canvas(){
    const outsideEvent = useRef(null);
    const canvasRefrence = useRef(null);
    const contextRefrence = useRef(null);
    const [isPressed,setIsPresssed] = useState(false);
    const width = 400;
    const height = 700;

    const outOfScope = () => {
        //how do we find out we are outside of the canvas
        
        
    }
    const beginDraw = (mouseEvent) => {
        contextRefrence.current.beginPath();
        contextRefrence.current.moveTo(mouseEvent.nativeEvent.offsetX,mouseEvent.nativeEvent.offsetY);
        setIsPresssed(true);
        
    };
    const moveDraw = (mouseEvent) => {
        //console.log(mouseEvent.nativeEvent.offsetX - width);
        if(!isPressed){
            return;
        }
        if(mouseEvent.onMouseLeave()){
            console.log("OUT");
        }
        contextRefrence.current.lineTo(mouseEvent.nativeEvent.offsetX,mouseEvent.nativeEvent.offsetY);
        contextRefrence.current.stroke();
    };
    const endDraw = () => {
        contextRefrence.current.closePath();
        setIsPresssed(false);
        
    };

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
    //console.log(mouseEvent);
    return(
        <div className="Player">
            <canvas 
            ref={canvasRefrence}
            onMouseDown={beginDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            />
        </div>
        
    )
}

export default Canvas;