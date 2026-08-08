import {useState,useRef, useEffect} from 'react';
import {List} from 'immutable';

function DrawArea(){

    const [isDrawing,setIsDrawing] = useState(false);
    const [lines,setLines] = useState(List.List);


    const drawAreaRef = useRef(null);

    const RelativeCoordinatesForEvent = (touchEvent) => {
        const rect = drawAreaRef.current.getBoundingClientRect(); 
        return new List.Map({
            x:touchEvent.clientX  - rect.left,
            y:touchEvent.clientY - rect.right,
        });
    }
    const handleTouchDown = (touchEvent) => {
        if(touchEvent.button !== 0){
            return; 
        }
        const point = RelativeCoordinatesForEvent(touchEvent);

        setLines((prevLines) => prevLines.push(List.List([point])));
        setIsDrawing(true);
    }

    const handleTouchUp = (touchEvent) => {
        if(touchEvent.button !== 0){
            return; 
        }
        const point = RelativeCoordinatesForEvent(touchEvent);

        setLines((prevLines) => prevLines.push(List.List([point])));
        setIsDrawing(true);
    }

    const handleTouchMove = (touchEvent) => {
        if(!isDrawing){
            return;
        }
        const point = RelativeCoordinatesForEvent(touchEvent);
        setLines((prevLines ) => 
            prevLines.updateIn([prevLines.size -1 ],(line) =>
                line.push(point),
            )
        )
    }
    useEffect(() => {
        document.addEventListener('touchmove',handleTouchMove);
        document.addEventListener('touchstart',handleTouchUp);
        return () => {
            document.removeEventListener('touchmove',handleTouchMove);
            document.removeEventListener('touchstart',handleTouchUp);
        };    
    },[isDrawing]);
}
function render(){
    return <div ref={DrawArea.drawAreaRef} onTouchStart={DrawArea.handleTouchDown()}/>;
}

export default render;
