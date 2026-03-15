import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import NavbarComponent from '../components/Navbar';
import { facilitiesAPI, reservationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookFacility = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    facility: location.state?.facility?._id || '',
    department: '',
    dateFrom: '',
    dateTo: '',
    timeFrom: '',
    timeTo: '',
    purpose: '',
    teacherName: user?.role === 'student' ? '' : user?.name || '',
    section: user?.section || '',
    equipment: {
      fans: 0,
      aircon: false,
      soundSystem: false,
      smartTV: false,
      chairs: 0,
      tables: 0,
      wirelessMic: 0,
      wiredMic: 0,
      ledScreen: false,
      redCarpet: false,
      stageLighting: false,
    },
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await facilitiesAPI.getAll();
      setFacilities(res.data);
    } catch (err) {
      setError('Failed to fetch facilities');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEquipmentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      equipment: {
        ...formData.equipment,
        [name]: type === 'checkbox' ? checked : parseInt(value) || 0,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      await reservationsAPI.create(formData);

      setSuccess('Reservation submitted successfully!');
      setShowConfirmation(false);

      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid className="page-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={20} />
          Go Back
        </button>

        <Card className="book-form-container">
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">PROPERTY MANAGEMENT OFFICE</h2>
            <h4 className="bg-warning text-dark d-inline-block px-4 py-2 rounded fw-bold">
              PERMIT TO USE
            </h4>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>Name:</strong> {user?.name}</Form.Label>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>Date Filled:</strong> {new Date().toLocaleDateString()}</Form.Label>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label><strong>Department:</strong></Form.Label>
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CCIS">College of Computing and Information Sciences</option>
                <option value="CAS">College of Arts and Sciences</option>
                <option value="CTED">College of Teacher Education</option>
                <option value="COE">College of Engineering</option>
                <option value="CBA">College of Business Administration</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <h5 className="form-section-title">FACILITIES</h5>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <div className="d-flex flex-wrap gap-3">
                    {facilities.map((facility) => (
                      <Form.Check
                        key={facility._id}
                        type="radio"
                        id={`facility-${facility._id}`}
                        name="facility"
                        label={facility.name}
                        value={facility._id}
                        checked={formData.facility === facility._id}
                        onChange={handleChange}
                        required
                      />
                    ))}
                    <Form.Check
                      type="radio"
                      id="facility-other"
                      name="facility"
                      label="Others (Pls. Specify): _________"
                      value="other"
                      checked={formData.facility === 'other'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="form-section-title">USAGE</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>DATE From:</strong></Form.Label>
                  <Form.Control
                    type="date"
                    name="dateFrom"
                    value={formData.dateFrom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>To:</strong></Form.Label>
                  <Form.Control
                    type="date"
                    name="dateTo"
                    value={formData.dateTo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>TIME From:</strong></Form.Label>
                  <Form.Control
                    type="time"
                    name="timeFrom"
                    value={formData.timeFrom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label><strong>To:</strong></Form.Label>
                  <Form.Control
                    type="time"
                    name="timeTo"
                    value={formData.timeTo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label><strong>Purpose:</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Enter the purpose of your reservation"
                required
              />
            </Form.Group>

            {user?.role === 'student' && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label><strong>Teacher Name:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleChange}
                      placeholder="Enter teacher's name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label><strong>Section:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="Enter your section"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <h5 className="form-section-title">EQUIPMENT</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Fans No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="fans"
                    value={formData.equipment.fans}
                    onChange={handleEquipmentChange}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Aircon"
                    name="aircon"
                    checked={formData.equipment.aircon}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Sound System"
                    name="soundSystem"
                    checked={formData.equipment.soundSystem}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Smart TV"
                    name="smartTV"
                    checked={formData.equipment.smartTV}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Chairs No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="chairs"
                    value={formData.equipment.chairs}
                    onChange={handleEquipmentChange}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tables No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="tables"
                    value={formData.equipment.tables}
                    onChange={handleEquipmentChange}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Wireless Mic No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="wirelessMic"
                    value={formData.equipment.wirelessMic}
                    onChange={handleEquipmentChange}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Wired Mic No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="wiredMic"
                    value={formData.equipment.wiredMic}
                    onChange={handleEquipmentChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="LED Screen"
                    name="ledScreen"
                    checked={formData.equipment.ledScreen}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Red Carpet"
                    name="redCarpet"
                    checked={formData.equipment.redCarpet}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Stage Lighting"
                    name="stageLighting"
                    checked={formData.equipment.stageLighting}
                    onChange={handleEquipmentChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info" className="mb-3">
              <strong>Note:</strong> For using LED, Stage Lighting and Red Carpet, secure an approval letter from the School President.
            </Alert>

            <Form.Group className="mb-4">
              <Form.Label><strong>Remarks:</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter your answer"
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'SUBMIT !'}
              </Button>
            </div>
          </Form>
        </Card>

        {showConfirmation && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowConfirmation(false)}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">⚠️ CONTINUE TO SUBMISSION:</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowConfirmation(false)}
                  ></button>
                </div>
                <div className="modal-body text-center py-4">
                  <p className="mb-3">Please review your details before submitting</p>
                  <h5 className="fw-bold">Are you Sure you Want to Submit?</h5>
                </div>
                <div className="modal-footer justify-content-center">
                  <Button variant="success" onClick={confirmSubmit} disabled={loading} className="px-5">
                    Yes
                  </Button>
                  <Button variant="danger" onClick={() => setShowConfirmation(false)} className="px-5">
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default BookFacility;