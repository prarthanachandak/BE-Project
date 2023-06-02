import React, { useState } from "react";

const Room = ({ room }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div className="card horizontal">
      <div className="card-stacked room-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
>     {isHovered && (
        <div className="info-box">
         <ul>
            <li>Room Name: {room.name}</li>
            <li>Age Group: {room.age} </li>
            <li>Room Domain: {room.domain}</li>
            <li>Room Rating: {Math.round(room.rating)}</li>
         </ul>
        </div>
      )}
        <div className="card-content">
          <p>{!isHovered?room.name:<span></span>}</p>
        </div>
      </div>
    </div>
  );
};

export default Room;
