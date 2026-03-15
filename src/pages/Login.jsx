import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/logo192.png"
          alt="SMCC Logo"
          className="login-logo"
        />
        
        <h1 className="system-title">SchedU</h1>
        <p className="system-subtitle">PMO Scheduling & Reservation System</p>
        <p className="institution-name">Saint Michael College of Caraga</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email / Username / I.D</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Login as</Form.Label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === 'teacher' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('teacher')}
              >
                Teacher
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('admin')}
              >
                Admin
              </button>
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="btn-primary-custom w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;