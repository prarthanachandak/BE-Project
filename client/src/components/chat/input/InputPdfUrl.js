import React from 'react';
import './Input.css';
const InputPdfUrl = ({ PdfUrl, setPdfUrl, sendPdfUrl }) => {
    return (
        <form action="" onSubmit={sendPdfUrl} className="form">
            <input type="text" className="input"
                placeholder="Enter book link here"
                value={PdfUrl}
                onChange={event => setPdfUrl(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendPdfUrl(event) : null}
            />
            <button className="sendButton">Read Book</button>
        </form>
    )
}

export default InputPdfUrl
