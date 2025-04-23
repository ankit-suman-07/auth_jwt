import React, { useState, useEffect } from 'react'
import './SignUp.css'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        // Perform login logic here
        console.log('Logging in with', username, password);
    }

    useEffect(() => {
        // Define the username and password you want to send
        const credentials = {
            username: 'yourUsername',
            password: 'yourPassword'
        };
    
        // Send POST request
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login response:', data);
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
    }, []);
    
  return (
    <div className='login' >
        <div className='login-box' >
            <div className='login-header' >Log In</div>
            <div className='login-username' >
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='login-password' >
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />      
            </div>
            <div className='login-btn' >
                <button onClick={() => login}>Log In</button>
            </div>
        </div>
    </div>
  )
}

export default SignUp