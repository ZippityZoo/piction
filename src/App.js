import './App.css';
import Host from './Host.js';
import {useState} from 'react';
import Client from './Client.js';
import Login from './Login.js';
function App() {
  const [username,setUsername] = useState("");

  document.body.style.overflow = "hidden"
  //needsome 
  if(username === "RAQ"){
    return <Host/>;
  }else if(username){
    return <Client username={username} />;
  }else{
    return <Login onSubmit={setUsername}/>
  }
  /*
  return (
    <div>
    <Login onSubmit={setUsername}/>
    </div>
  );
  */
}



export default App;
