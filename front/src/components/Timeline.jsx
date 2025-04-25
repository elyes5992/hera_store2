// components/Timeline.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import './Timeline.css';

const Timeline = ({ events }) => {
  return (
    <div className="timeline-container">
      {events.map((event, index) => (
        <div key={index} className={`timeline-item ${event.status}`}>
          <div className="timeline-icon">
            {event.status === 'completed' ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaCircle className="text-muted" />
            )}
          </div>
          <div className="timeline-content">
            <h5>{event.title}</h5>
            {event.date && (
              <p className="timeline-date">
                {new Date(event.date).toLocaleDateString()} 
                {' '} 
                {new Date(event.date).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;