import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="navbar-brand-custom">
          <img
            src="/logo192.png"
            alt="SMCC Logo"
            className="nav-logo-img"
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.9 }}>SMCC</div>
            <div>SchedU</div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" style={{ backgroundColor: 'white' }} />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/facilities"
              className={`nav-link-custom ${isActive('/facilities') ? 'active' : ''}`}
            >
              Facilities
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/reservations"
              className={`nav-link-custom ${isActive('/reservations') ? 'active' : ''}`}
            >
              Reservations
            </Nav.Link>

            {user && user.role === 'admin' && (
              <Nav.Link
                as={Link}
                to="/admin"
                className={`nav-link-custom ${isActive('/admin') ? 'active' : ''}`}
              >
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center">
            {user && (
              <>
                <span className="user-badge">
                  {user.name} ({user.role})
                </span>
                <FiLogOut 
                  size={22} 
                  className="logout-icon" 
                  onClick={handleLogout}
                  title="Logout"
                />
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;