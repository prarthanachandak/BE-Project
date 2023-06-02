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
    <div className="card horizontal center">
      <div className="card-stacked room-card" style={{background: "#33691E",}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
>     {isHovered && (
        <div className="info-box">
         <ul>
            <li style={{color:"white", fontWeight:"bold"}}>Room Name: {room.name}</li>
            <li style={{color:"white", fontWeight:"bold"}}>Age Group: {room.age} </li>
            <li style={{color:"white", fontWeight:"bold"}}>Room Domain: {room.domain}</li>
            <li style={{color:"white", fontWeight:"bold"}}>Room Rating: {room.rating.toFixed(1)}</li>
         </ul>
        </div>
      )}
        <div className="card-content">
          <p style={{color:"white", fontWeight:"bold", borderRadius:"20px"}}>{!isHovered?room.name:<span></span>}</p>
        </div>
      </div>
    </div>
  );
};

export default Room;
