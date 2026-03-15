import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FiCalendar, FiClock, FiUser, FiEdit, FiTrash2, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const ReservationCard = ({ reservation, onEdit, onCancel, onApprove, onReject, showActions = true, isAdmin = false }) => {
  const getStatusIcon = () => {
    switch (reservation.status) {
      case 'Approved':
        return <FiCheckCircle size={16} />;
      case 'Pending':
        return <FiAlertCircle size={16} />;
      case 'Rejected':
        return <FiXCircle size={16} />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className={`reservation-card ${reservation.status.toLowerCase()}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{reservation.facility?.name || 'N/A'}</h5>
            <p className="text-muted mb-0">{reservation.purpose}</p>
          </div>
          <span className={`reservation-status ${reservation.status.toLowerCase()}`}>
            {getStatusIcon()}
            {reservation.status}
          </span>
        </div>

        <Row className="mb-3">
          <Col md={3} className="mb-2">
            <div className="d-flex align-items-center text-muted mb-1">
              <FiCalendar size={14} className="me-2" />
              <small>Date</small>
            </div>
            <div><strong>{formatDate(reservation.dateFrom)}</strong></div>
          </Col>

          <Col md={3} className="mb-2">
            <div className="d-flex align-items-center text-muted mb-1">
              <FiClock size={14} className="me-2" />
              <small>Time</small>
            </div>
            <div><strong>{reservation.timeFrom} - {reservation.timeTo}</strong></div>
          </Col>

          <Col md={3} className="mb-2">
            <div className="d-flex align-items-center text-muted mb-1">
              <FiUser size={14} className="me-2" />
              <small>Requester</small>
            </div>
            <div><strong>{reservation.user?.name || 'N/A'}</strong></div>
          </Col>

          {reservation.teacherName && (
            <Col md={3} className="mb-2">
              <div className="text-muted mb-1">
                <small>Teacher</small>
              </div>
              <div><strong>{reservation.teacherName}</strong></div>
            </Col>
          )}

          {reservation.section && (
            <Col md={3} className="mb-2">
              <div className="text-muted mb-1">
                <small>Section</small>
              </div>
              <div><strong>{reservation.section}</strong></div>
            </Col>
          )}
        </Row>

        {reservation.remarks && (
          <div className="mb-3">
            <small className="text-muted">Remarks:</small>
            <p className="mb-0">{reservation.remarks}</p>
          </div>
        )}

        {showActions && (
          <div className="d-flex gap-2 flex-wrap">
            {isAdmin && reservation.status === 'Pending' && (
              <>
                <Button variant="success" size="sm" onClick={() => onApprove(reservation._id)}>
                  Approve
                </Button>
                <Button variant="danger" size="sm" onClick={() => onReject(reservation._id)}>
                  Reject
                </Button>
              </>
            )}

            {!isAdmin && reservation.status === 'Pending' && (
              <>
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(reservation)}>
                  <FiEdit size={14} className="me-1" />
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onCancel(reservation._id)}>
                  <FiTrash2 size={14} className="me-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReservationCard;