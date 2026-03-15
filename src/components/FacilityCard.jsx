import React from 'react';
import { Card } from 'react-bootstrap';
import { FiUsers, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const FacilityCard = ({ facility, onClick }) => {
  const getIcon = (type) => {
    const icons = {
      'Stage': '🏀',
      'Quadrangle': '🌳',
      'AVR': '🎥',
      'ACCRE': '📄',
      'Dance Hall': '💃',
      'DT Lab': '🏛️',
    };
    return icons[type] || '🏛️';
  };

  return (
    <Card className="facility-card" onClick={onClick}>
      <div className="facility-card-header">
        <div className="facility-icon">{getIcon(facility.type)}</div>
      </div>
      <Card.Body className="facility-card-body">
        <h5>{facility.name}</h5>

        <div className="facility-info">
          <FiUsers size={16} />
          <span>Capacity: {facility.capacity}</span>
        </div>

        <div className="facility-info">
          <FiMapPin size={16} />
          <span>{facility.location}</span>
        </div>

        <div>
          <span className={`status-badge ${facility.status.toLowerCase()}`}>
            {facility.status === 'Available' ? (
              <>
                <FiCheckCircle size={14} />
                Available
              </>
            ) : (
              <>
                <FiXCircle size={14} />
                {facility.status}
              </>
            )}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FacilityCard;