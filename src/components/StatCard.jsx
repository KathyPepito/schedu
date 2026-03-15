import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ icon, count, label, variant }) => {
  return (
    <Card className={`stat-card ${variant}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{count}</h3>
        <p>{label}</p>
      </div>
    </Card>
  );
};

export default StatCard;