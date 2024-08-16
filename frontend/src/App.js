import { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
    function sendMessage() {
        console.log('Button clicked');

        socket.emit('send_message', { message: 'Hello from client' });
    }
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data.message);
        });
    }, []);

    return (
        <div>
            <textarea placeholder="message" />
            <button onClick={sendMessage}>Send message</button>
        </div>
    );
}

export default App;
