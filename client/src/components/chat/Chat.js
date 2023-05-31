import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Messages from './messages/Messages';
import InputChat from './input/InputChat';
import InputVideoUrl from './input/InputVideoUrl';
import InputPdfUrl from './input/InputPdfUrl';
import StarRating from './rating/Rating';
import './Chat.css';
import YouTube from 'react-youtube';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import RoomList from '../home/RoomList'
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
 
let socket;
const Chat = () => {
    
    const ENDPT = '127.0.0.1:5000';
    const { user} = useContext(UserContext);
    let { room_id } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [videoUrl,setVideoUrl]=useState('');
    const [videoId,setVideoId]=useState('');
    const [pdfUrl,setPdfUrl]=useState('');
    const [pdfId,setPdfId]=useState('');
    const [showFirst, setShowFirst] = useState(false);
    const [showSecond, setShowSecond] = useState(false);
    const [rating, setRating] = useState(0);
    const [similarRooms, setSimilarRooms] = useState([]);

    useEffect(() => {
        socket = io(ENDPT);
        socket.emit('join', { name: user.name, room_id, user_id: user._id });
    }, [])
    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])
    useEffect(() => {
        socket.emit('get-videoUrl', room_id)
        socket.on('display-video', link => {
            console.log(link);
            setVideoId(link);
        })
    }, [videoId])
    useEffect(() => {
        socket.on('rec-similar-rooms', similarRooms => {
            setSimilarRooms(similarRooms)
        })

    }, [])
    useEffect(() => {
        socket.emit('get-pdfUrl', room_id)
        socket.on('display-pdf', pdflink => {
            console.log(pdflink);
            setPdfId(pdflink);
        })
    }, [pdfId])

    useEffect(() => {
        socket.emit('get-messages-history', room_id)
        socket.on('output-messages', messages => {
            setMessages(messages)
            console.log("messages are",messages);
        })
    }, [])

    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            console.log(message);
            socket.emit('sendMessage', message, room_id, () => setMessage(''))
        }
    }
    const sendRecommends = event => {
        setShowFirst(false);
        setShowSecond(true);
        console.log(room_id);
        event.preventDefault();
        socket.emit('sendRecommends', room_id);

    }
    const sendVideoUrl = event => {
        event.preventDefault();
        if (videoUrl) {
            console.log(videoUrl);
            socket.emit('sendVideoUrl', videoUrl, room_id, () => setVideoUrl(''))
        }
    }
    const sendPdfUrl = event => {
        event.preventDefault();
        if (pdfUrl) {
            console.log(pdfUrl);
            socket.emit('sendPdfUrl', pdfUrl, room_id, () => setPdfUrl(''))
        }
    }
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
      };
    const handleRatingChange = (newRating) => {
       setRating(newRating);
       socket.emit('update-rating', room_id, newRating)
    };

    const handleFirstButtonClick = () => {
        setShowFirst(true);
        setShowSecond(false);
    };

    // const handleSecondButtonClick = () => {
    //     setShowFirst(false);
    //     setShowSecond(true);
    //     console.log(room_id);
    // };

      
    return (
        <div className="outerContainer">
            <div className="container" >
            <div>
                <StarRating rating={rating} onRatingChange={handleRatingChange} />
                {/* <p>Room rating: {roomRating}</p> */}
            </div>
            {/* <button onClick={sendRecommends}>recommend rooms</button> */}
                <Messages messages={messages} user_id={user._id} />
                <InputChat
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
                <button className="share-video" onClick={handleFirstButtonClick}>Watch Lecture</button>
                {/* <button className="share-video" onClick={handleSecondButtonClick}>Read Book</button> */}
                <button className = "share-video" onClick={sendRecommends}>Join Similar Rooms</button>
            </div>
            
            {showFirst && (
            <div className="container">
            <YouTube videoId={videoId} opts={opts}/>
                <InputVideoUrl
                    videoUrl={videoUrl}
                    setVideoUrl={setVideoUrl}
                    sendVideoUrl={sendVideoUrl}
                />
                {/* <input className="input" type="text" value={videoId} onChange={e=>{setVideoId(e.target.value)}}/> */}
            {/* <button type="submit">submit</button>; */}
        </div>
             )}

            {showSecond && (
            <div className='container'>
                {/* <Document 
                    file={pdfUrl}
                    className="pdf-document"
                    scale={0.5}>
                    <Page pageNumber={1} />
                    <InputPdfUrl
                        pdfUrl={pdfUrl}
                        setVideoUrl={setVideoUrl}
                        sendVideoUrl={sendPdfUrl}
                    />
                </Document> */}
                {similarRooms.length>0 && (
                    <div className='col s6 m5 offset-1'>
                    <RoomList rooms={similarRooms} />
                </div>
                )}
            </div>
             )} 
            
            
        </div>
    )
}

export default Chat
