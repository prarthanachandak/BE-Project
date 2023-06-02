import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Messages from "./messages/Messages";
import InputChat from "./input/InputChat";
import InputVideoUrl from "./input/InputVideoUrl";
import InputPdfUrl from "./input/InputPdfUrl";
import StarRating from "./rating/Rating";
import "./Chat.css";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";

import RoomList from "../home/RoomList";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let socket;
const Chat = () => {
  const ENDPT = "127.0.0.1:5000";
  const { user } = useContext(UserContext);
  let { room_id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfId, setPdfId] = useState("");
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [rating, setRating] = useState(0);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [room_name, setRoomName] = useState("");
  const [room_age, setRoomAge] = useState(0);
  const [room_domain, setRoomDomain] = useState("");
  const [room_rating, setRoomRating] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit("join", { name: user.name, room_id, user_id: user._id });
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  useEffect(() => {
    socket.emit("get-videoUrl", room_id);
    socket.on("display-video", (link) => {
      console.log(link);
      setVideoId(link);
    });
  }, [videoId]);
  useEffect(() => {
    socket.on("rec-similar-rooms", (similarRooms) => {
      setSimilarRooms(similarRooms);
    });
  }, []);
  useEffect(() => {
    socket.emit("get-pdfUrl", room_id);
    socket.on("display-pdf", (pdflink) => {
      console.log(pdflink);
      setPdfId(pdflink);
    });
  }, [pdfId]);

  useEffect(() => {
    socket.emit("get-messages-history", room_id);
    socket.on("output-messages", (messages) => {
      setMessages(messages);
      console.log("messages are", messages);
    });
  }, []);

  useEffect(() => {
    socket.emit("get-room-name", room_id);
    socket.on("display-name", (name) => {
      setRoomName(name);
      console.log("room_name", name);
    });
  });
  useEffect(() => {
    socket.emit("get-room-age", room_id);
    socket.on("display-age", (age) => {
      setRoomAge(age);
      console.log("room_name", age);
    });
  });
  useEffect(() => {
    socket.emit("get-room-domain", room_id);
    socket.on("display-domain", (domain) => {
      setRoomDomain(domain);
      console.log("room_name", domain);
    });
  });
  useEffect(() => {
    socket.emit("get-room-rating", room_id);
    socket.on("display-rating", (rating) => {
      setRoomRating(Math.round(rating));
      console.log("room_name", rating);
    });
  });
  // useEffect(()=>{
  //     socket.emit('get-room-rating',room_id)
  //     socket.on('display-rating',rating=>{
  //         setRating(rating)
  //         console.log("room_rating", rating);
  //     })
  // })
  const handleHover = () => {
    setIsHovered(!isHovered);
  };
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      console.log(message);
      socket.emit("sendMessage", message, room_id, () => setMessage(""));
    }
  };
  const sendRecommends = (event) => {
    setShowFirst(false);
    setShowSecond(true);
    console.log(room_id);
    event.preventDefault();
    socket.emit("sendRecommends", room_id);
  };
  const sendVideoUrl = (event) => {
    event.preventDefault();
    if (videoUrl) {
      console.log(videoUrl);
      socket.emit("sendVideoUrl", videoUrl, room_id, () => setVideoUrl(""));
    }
  };
  const sendPdfUrl = (event) => {
    event.preventDefault();
    if (pdfUrl) {
      console.log(pdfUrl);
      socket.emit("sendPdfUrl", pdfUrl, room_id, () => setPdfUrl(""));
    }
  };
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    socket.emit("update-rating", room_id, newRating);
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
      <div className="container">
        <div class="heading">
          <h4>{room_name}</h4>
          <div className="decription-container">
            <FontAwesomeIcon
              className="question-icon"
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
              icon={faQuestionCircle}
            />
            {isHovered && (
              <div className="description-box">
                <ul>
                  <li>Room Name: {room_name}</li>
                  <li>Age Group: {room_age} </li>
                  <li>Room Domain: {room_domain}</li>
                  <li>Room Rating: {room_rating}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          {/* <p>Room rating: {roomRating}</p> */}
        </div>
        {/* <button onClick={sendRecommends}>recommend rooms</button> */}
        <Messages messages={messages} user_id={user._id} />
        <div class="chat-options">
          <InputChat
            className="chat-input"
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
          <button className="share-video" onClick={handleFirstButtonClick}>
            Watch Lecture
          </button>
          {/* <button className="share-video" onClick={handleSecondButtonClick}>Read Book</button> */}
          <button className="share-video" onClick={sendRecommends}>
            Join Similar Rooms
          </button>
        </div>
      </div>

      {showFirst && (
        <div className="container">
          <YouTube videoId={videoId} opts={opts} />
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
        <div className="container">
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
          {similarRooms.length > 0 && (
            <div className="col s6 m5 offset-1">
              <RoomList rooms={similarRooms} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
