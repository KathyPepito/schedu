import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import NavbarComponent from '../components/Navbar';
import ReservationCard from '../components/ReservationCard';
import { reservationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
  try {
    setLoading(true);
    setError('');
    const res = await reservationsAPI.getAll();
    setReservations(res.data || []);
  } catch (err) {
    console.error('Reservations fetch error:', err);
    setError(err.response?.data?.message || 'Failed to fetch reservations');
    setReservations([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (reservation) => {
    console.log('Edit reservation:', reservation);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationsAPI.delete(id);
        setSuccess('Reservation cancelled successfully');
        fetchReservations();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel reservation');
      }
    }
  };

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
          <h2>My Reservations</h2>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No reservations found.</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onEdit={handleEdit}
              onCancel={handleCancel}
              showActions={true}
              isAdmin={user?.role === 'admin'}
            />
          ))
        )}
      </Container>
    </>
  );
};

export default Reservations;