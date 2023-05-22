import React from 'react';
import './Input.css';
const InputVideoUrl = ({ VideoUrl, setVideoUrl, sendVideoUrl }) => {
    return (
        <form action="" onSubmit={sendVideoUrl} className="form">
            <input type="text" className="input"
                placeholder="Enter lecture link here"
                value={VideoUrl}
                onChange={event => setVideoUrl(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendVideoUrl(event) : null}
            />
            <button className="sendButton">Watch Lecture</button>
        </form>
    )
}

export default InputVideoUrl
