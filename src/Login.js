import {useState} from 'react';
function Login({onSubmit}){
    const [username, setUserName] = useState("");
    return(
        <>
            <h2>What's Your Name</h2>
            <form onSubmit={(e) =>{
                e.preventDefault();
                onSubmit(username);
            }}
            >
            <input 
            type="text"
            value={username}
            placeholder="username"
            onChange ={(e) => setUserName(e.target.value)}
            />
            <input type="submit"/>
            </form>
        </>
        
    )
}

export default Login;