import React, { useState, useEffect } from 'react'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        // Perform login logic here
        console.log('Logging in with', username, password);
    }

    useEffect(() => {
        // Fetch the data from the server
        fetch('/api/signup')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
  return (
    <div>
        <div>
            <div>Log In</div>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />      
            </div>
            <div>
                <button onClick={() => login}>Sign Up</button>
            </div>
        </div>
    </div>
  )
}

export default SignUp