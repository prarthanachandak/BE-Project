import React from "react";
import "./Rating.css";
import { useState, useRef, useEffect } from "react";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

const StarRating = ({ rating, onRatingChange }) => {
  const starRatingRef = useRef(null);

  useEffect(() => {
    M.Tooltip.init(starRatingRef.current, {
      position: 'bottom',
      margin: 1500,
    //   transitionMovement: 500,
      transitionHover: 300
    });
  }, []);


  const handleRatingChange = (newRating) => {
    onRatingChange(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starClass = i <= rating ? 'material-icons green-text' : 'material-icons';
      stars.push(
        <i
          key={i}
          className={starClass}
          data-position="top"
          data-tooltip={`${i} star`}
          onClick={() => handleRatingChange(i)}
        >
          star
        </i>
      );
    }
    return stars;
  };

  return (
    <div ref={starRatingRef} className="star-rating" style={{ display: 'inline-block', cursor:"pointer" }}>
      {renderStars()}
    </div>
  );
};

export default StarRating;
