import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FiBarChart2, FiCalendar, FiSettings } from 'react-icons/fi';
import NavbarComponent from '../components/Navbar';
import ReservationCard from '../components/ReservationCard';
import { reservationsAPI } from '../services/api';

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationsAPI.getAll();
      setReservations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reservationsAPI.approve(id);
      setSuccess('Reservation approved successfully');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve reservation');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (reason) {
      try {
        await reservationsAPI.reject(id, reason);
        setSuccess('Reservation rejected successfully');
        fetchReservations();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reject reservation');
      }
    }
  };

  const pendingReservations = reservations.filter(r => r.status === 'Pending');

  if (loading) {
    return (
      <>
        <NavbarComponent />
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarComponent />
      <Container fluid className="page-container">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <div className="section-header">
          <h2>Admin Panel</h2>
        </div>

        <Row className="mb-5">
          <Col lg={4} className="mb-3">
            <Card className="text-center p-4 h-100">
              <div className="mx-auto mb-3" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-blue))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiBarChart2 size={40} color="white" />
              </div>
              <h5>Generate Reports</h5>
              <p className="text-muted">View usage statistics and analytics</p>
              <Button variant="primary">View Reports</Button>
            </Card>
          </Col>

          <Col lg={4} className="mb-3">
            <Card className="text-center p-4 h-100">
              <div className="mx-auto mb-3" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-blue))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiCalendar size={40} color="white" />
              </div>
              <h5>Manage Schedules</h5>
              <p className="text-muted">Update facility availability</p>
              <Button variant="primary">Manage</Button>
            </Card>
          </Col>

          <Col lg={4} className="mb-3">
            <Card className="text-center p-4 h-100">
              <div className="mx-auto mb-3" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-blue))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiSettings size={40} color="white" />
              </div>
              <h5>System Settings</h5>
              <p className="text-muted">Configure system preferences</p>
              <Button variant="primary">Settings</Button>
            </Card>
          </Col>
        </Row>

        <div className="section-header">
          <h2>Pending Approvals</h2>
        </div>

        {pendingReservations.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No pending reservations.</p>
          </div>
        ) : (
          pendingReservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={true}
              isAdmin={true}
            />
          ))
        )}
      </Container>
    </>
  );
};

export default AdminPanel;