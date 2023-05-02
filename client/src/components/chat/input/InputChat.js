import React from 'react';
import './Input.css';
const Input = ({ message, setMessage, sendMessage }) => {
    return (
        <div>
            <form action="" onSubmit={sendMessage} className="form">
            <input type="text" className="input"
                placeholder="Type a message"
                value={message}
                onChange={event => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
            />
            <button className="sendButton">Send Message</button>
        </form>

        {/* <form action="" onSubmit={sendVideoURL} className="form">
            <input type="text" className="input"
                placeholder="Enter a video url"
                value={videoURL}
                onChange={event => setVideoURL(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendVideoURL(event) : null}
            />
            <button className="sendButton">Watch Lecture</button>

        </form> */}

        </div>
        
    )
}

export default Input
