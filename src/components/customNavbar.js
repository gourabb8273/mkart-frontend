import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon from react-icons
import { useDispatch, useSelector } from 'react-redux'


import LoginButton from './loginButton';
import LogoutButton from './logoutButton';

function CustomNavbar({ user, isAuthenticated, auth0Id, logout, showModal, setShowModal }) {

  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // Update Redux state when login is successful
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(saveUserData({
  //       auth0Id, isLoggedIn: isAuthenticated,
  //       profile: { name: user && user.name, email: user && user.email, picture: user && user.picture }
  //     }));
  //   }
  // }, [isLoggedIn]);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#home">Mkart</Navbar.Brand>
        <Nav className="ml-auto">
          {!isAuthenticated ? (
            <LoginButton />
          ) : (
            <>
              <Navbar.Text className="text-light mx-3">
                Welcome, {user && user.name}
              </Navbar.Text>
              {/* Profile dropdown at the very end */}
              <Nav className="ml-auto">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="custom-dropdown-toggle" id="dropdown-basic">
                    {/* Profile Icon */}
                    <FaUserCircle size={30} style={{ color: 'white' }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#profile" onClick={() => setShowModal(true)}>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => logout({ returnTo: window.location.origin })}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
