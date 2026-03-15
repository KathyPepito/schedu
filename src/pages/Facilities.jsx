import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import NavbarComponent from '../components/Navbar';
import FacilityCard from '../components/FacilityCard';
import { facilitiesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    sort: 'name',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFacilities();
  }, [filters]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await facilitiesAPI.getAll(filters);
      setFacilities(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
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
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="section-header">
          <h2>Available Facilities</h2>
        </div>

        <Row className="mb-4">
          <Col md={4} className="mb-2">
            <Form.Select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Stage">Stage</option>
              <option value="Quadrangle">Quadrangle</option>
              <option value="AVR">AVR</option>
              <option value="ACCRE">ACCRE</option>
              <option value="Dance Hall">Dance Hall</option>
              <option value="DT Lab">DT Lab</option>
            </Form.Select>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </Form.Select>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="name">Sort by Name</option>
              <option value="capacity">Sort by Capacity</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          {facilities.map((facility) => (
            <Col lg={4} md={6} className="mb-4" key={facility._id}>
              <FacilityCard
                facility={facility}
                onClick={() => navigate('/book-facility', { state: { facility } })}
              />
            </Col>
          ))}
        </Row>

        {facilities.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No facilities found.</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default Facilities;