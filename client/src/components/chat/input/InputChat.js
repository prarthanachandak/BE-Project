import React from "react";
import "./Input.css";
const Input = ({ message, setMessage, sendMessage }) => {
    const handleKeyDown = (event) => {
        if (event.shiftKey && event.key === 'Enter') {
          event.preventDefault();
          setMessage((prevText) => prevText + '\n');
        }
      };
  return (
    <div>
      <form action="#" className="form">
        <button className="share-video" onClick={null}>Read Book</button>
        <button className="share-video" onClick={null}>Watch Lecture</button>
        <div className="message">
          <textarea
            type="text"
            className="input"
            placeholder="Type a message"
            value={message}
                onChange={event => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                onKeyDown={handleKeyDown}
          />
          <span className="sendButton" onClick={sendMessage}>
            Send 
          </span>
        </div>
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
  );
};

export default Input;
