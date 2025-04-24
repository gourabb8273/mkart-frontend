import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import LoginBtn from './LoginBtn';

const BRAND_NAME = "Mkart Demo";
const PROFILE_ICON_SIZE = 25;
const MENU_ITEMS = {
  PROFILE: "My Profile",
  LOGOUT: "Logout",
  WELCOME: "Welcome,",
  ORDERS: "Orders History"
};

function CustomNavbar({ user, isAuthenticated, handleLogout, showModal, setShowModal }) {
  return (
    <Navbar expand="lg" className="py-0" style={{ backgroundColor: '#198754' }}> 
    {/* '#0d6efd' */}
      <Container fluid>
        <Navbar.Brand href="#home" className="fs-6 text-light">{BRAND_NAME}</Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">{!isAuthenticated && <LoginBtn />}</Nav>
        </Navbar.Collapse>

        {isAuthenticated && (
          <div className="d-flex align-items-center ms-auto">
            <Navbar.Text className="text-light me-2 d-none d-lg-block">
              {MENU_ITEMS.WELCOME} {user?.name}
            </Navbar.Text>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="custom-dropdown-toggle p-0">
                <FaUserCircle size={PROFILE_ICON_SIZE} style={{ color: 'white' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Item onClick={() => setShowModal(true)}>{MENU_ITEMS.PROFILE}</Dropdown.Item>
                <Dropdown.Item onClick={() => window.location.href = "/orders"}>{MENU_ITEMS.ORDERS}</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>{MENU_ITEMS.LOGOUT}</Dropdown.Item>
               
              </Dropdown.Menu>
              
            </Dropdown>
          </div>
        )}
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
