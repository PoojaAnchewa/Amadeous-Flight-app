// src/App.js
import React, { useState } from 'react';
import MainApp from './components/main_app';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [auth, setAuth] = useState(false);

    const handleRegister = async () => {
        try {
            const response = await fetch('https://laughing-space-system-674p77v46p52r667-5000.app.github.dev/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('https://laughing-space-system-674p77v46p52r667-5000.app.github.dev/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            setMessage(data.message);
            setAuth(true);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="App">
            { auth==false ? (<><h1>Login and Register</h1>
                <div>
                    <label>
                        Username:
                        <input type="text" value={ username } onChange={ (e) => setUsername(e.target.value) } />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } />
                    </label>
                </div>
                <div>
                    <button onClick={ handleRegister }>Register</button>
                    <button onClick={ handleLogin }>Login</button>
                </div>
                <div>
                    <p>{ message }</p>
                </div></>) : (<MainApp setAuth={ setAuth } />) }
        </div>
    );
}

export default App;
