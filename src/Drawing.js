import './DrawArea.js';

function Drawing(lines){
    return (
        <svg>
            conslole.log(typeof(lines));
            {lines.map((line, index ) =>(
                <DrawingLine key ={index} line = {line} />
            ))};
        </svg>
    );
}
function DrawingLine({ line }) {
    const pathData =
      'M ' + line.map((p) => p.get('x') + ' ' + p.get('y')).join(' L ');
  
    return <path d={pathData} />;
  }
  export default Drawing;