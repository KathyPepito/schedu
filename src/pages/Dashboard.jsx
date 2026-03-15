import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiAlertCircle, FiUsers } from 'react-icons/fi';
import NavbarComponent from '../components/Navbar';
import StatCard from '../components/StatCard';
import FacilityCard from '../components/FacilityCard';
import { facilitiesAPI, reservationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    approved: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    setError('');

    // Fetch facilities and stats separately with error handling
    const facilitiesRes = await facilitiesAPI.getAll().catch(err => {
      console.error('Facilities fetch error:', err);
      return { data: [] };
    });

    const statsRes = await reservationsAPI.getStats().catch(err => {
      console.error('Stats fetch error:', err);
      return { data: { upcoming: 0, pending: 0, approved: 0, total: 0 } };
    });

    setFacilities(facilitiesRes.data || []);
    setStats(statsRes.data || { upcoming: 0, pending: 0, approved: 0, total: 0 });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    setError(err.response?.data?.message || 'Failed to fetch data');
  } finally {
    setLoading(false);
  }
};

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableFacilitiesCount = facilities.filter(f => f.status === 'Available').length;

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

        <div className="dashboard-header">
          <h1>Welcome Back, {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}!</h1>
          <p>Manage your facility reservations and schedules</p>
          <Button
            className="book-facility-btn"
            onClick={() => navigate('/book-facility')}
          >
            BOOK A FACILITY !
          </Button>
        </div>

        <div className="section-header">
          <h6 className="text-muted">Manage your facility reservations and schedules</h6>
        </div>

        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              icon={<FiCalendar size={28} />}
              count={stats.upcoming}
              label="Upcoming Reservations"
              variant="primary"
            />
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <StatCard
              icon={<FiCheckCircle size={28} />}
              count={availableFacilitiesCount}
              label="Facilities Available"
              variant="success"
            />
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <StatCard
              icon={<FiAlertCircle size={28} />}
              count={stats.pending}
              label="Pending Approval"
              variant="warning"
            />
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <StatCard
              icon={<FiUsers size={28} />}
              count={facilities.length}
              label="Total Facilities"
              variant="info"
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form.Control
              type="text"
              placeholder="Search for facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
            />
          </Col>
        </Row>

        <div className="section-header">
          <h2>Available Facilities</h2>
        </div>

        <Row>
          {filteredFacilities.map((facility) => (
            <Col lg={3} md={4} sm={6} className="mb-4" key={facility._id}>
              <FacilityCard
                facility={facility}
                onClick={() => navigate('/book-facility', { state: { facility } })}
              />
            </Col>
          ))}
        </Row>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No facilities found matching your search.</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default Dashboard;