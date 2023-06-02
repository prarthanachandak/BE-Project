import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import { Redirect } from "react-router-dom";
import RoomList from "./RoomList";
import io from "socket.io-client";
import "./Home.css";

let socket;
const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [recRooms, setRecRooms] = useState([]);
  const [link, setLink] = useState([]);
  const [age, setAge] = useState([]);
  const [domain, setDomain] = useState([]);
  const [recAge, setRecAge] = useState([]);
  const [recDomain, setRecDomain] = useState([]);
  const [recRating, setRecRating] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [risCollapsed, setRecIsCollapsed] = useState(true);
  var selection = "";
  const ENDPT = "127.0.0.1:5000";
  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPT]);
  useEffect(() => {
    socket.on("output-rooms", (rooms) => {
      setRooms(rooms);
    });
  }, []);
  useEffect(() => {
    socket.on("rec-rooms", (recRooms) => {
      setRecRooms(recRooms);
    });
  }, []);
  useEffect(() => {
    socket.on("room-created", (room) => {
      setRooms([...rooms, room]);
    });
  }, [rooms]);
  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("create-room", room, link, age, domain);
    console.log(room, link, age, domain);
    setRoom("");
    setLink("");
    setAge("");
    setDomain("");
  };
  const handleRecommendations = (e) => {
    e.preventDefault();
    socket.emit("rec-room", recDomain, recAge, recRating);
    setRecAge("");
    setRecDomain("");
    setRecRating("");
    console.log(recRooms);
  };
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setRecIsCollapsed(true);
    if(selection=="All"){
        selection = "";
    }
    else{
        selection = "All";
    }
  };

  const handleRecommendationCollapse = () => {
    setIsCollapsed(true);
    setRecIsCollapsed(!risCollapsed);
    if(selection=="Recommend"){
        selection = "";
    }
    else{
        selection = "Recommend";
    }
  };
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <div className="row">
        <div className="col s10 m6">
          <div className="card form-css">
            <div className="card-content create-room-card">
              <span className="title">
                Welcome {user ? user.name : ""}
              </span>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder="Enter a Study Room name"
                      id="room"
                      type="text"
                      className="validate"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    />
                    <input
                      placeholder="Enter age"
                      id="age"
                      type="number"
                      className="validate"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                    <input
                      placeholder="Enter domain of study"
                      id="domain"
                      type="text"
                      className="validate"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                    <input
                      placeholder="Enter lecture link"
                      id="link"
                      type="text"
                      className="validate"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                </div>
                <button className="create-room-button">Create Study Room</button>
              </form>
            </div>
            <div className="card-action"></div>
          </div>

          <div className="card form-css">
            <div className="card-content create-room-card">
              <span className="title">
                Get Personalized Room Recommendations
              </span>
              <form onSubmit={handleRecommendations}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder="Enter domain of study"
                      id="recdomain"
                      type="text"
                      className="validate"
                      value={recDomain}
                      onChange={(e) => setRecDomain(e.target.value)}
                    />
                    <input
                      placeholder="Enter age"
                      id="recage"
                      type="number"
                      className="validate"
                      value={recAge}
                      onChange={(e) => setRecAge(e.target.value)}
                    />
                    <input
                      placeholder="Enter reputation (out of 5)"
                      id="recrating"
                      type="number"
                      className="validate"
                      value={recRating}
                      onChange={(e) => setRecRating(e.target.value)}
                    />
                  </div>
                </div>
                <button className="create-room-button">Get Recommendations</button>
              </form>
            </div>
            <div className="card-action"></div>
          </div>
        </div>
        <div class="buttons">
        <button className="room-buttons" onClick={handleToggleCollapse}>
          All Rooms
        </button>
        <button
          className="room-buttons"
          onClick={handleRecommendationCollapse}
        >
          Recommended Rooms
        </button>
        </div>
        
        { !isCollapsed && (<div
          className={
            isCollapsed
              ? "collapsed col s6 m5 offset-1"
              : "expanded col s6 m5 offset-1"
          }
        >
          <RoomList rooms={rooms} />
        </div>)
        }
       
          {(recRooms.length && !risCollapsed) > 0 && (
            <div className="col s6 m5 offset-1">
              <RoomList rooms={recRooms} />
            </div>
          )}
          {recRooms.length == 0 && !risCollapsed && (
            <div className="col s6 m5 offset-1">
              <span >No Rooms Available!</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;
