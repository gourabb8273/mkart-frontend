import React, { useState ,useEffect} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Navbar, Nav, Container, Dropdown, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle } from 'react-icons/fa';  // Profile icon from react-icons
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'

import { saveUserData } from './redux/services/userAPI';

import LoginButton from './components/loginButton';
import LogoutButton from './components/logoutButton';
import UserProfileModal from './components/userProfileModal';
import CustomNavbar from './components/customNavbar';
import FeaturePage from './components/featurePage';

function App() {
  const { user, isAuthenticated, logout, jwt } = useAuth0();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  if(isAuthenticated)
    debugger
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    auth0Id: jwt, isLoggedIn: isAuthenticated, profile: { name: user && user.name, email: user && user.email, picture: user && user.picture }
  });

  useEffect(() => {
    if (isAuthenticated) {
      debugger
      dispatch(saveUserData({ auth0Id: jwt, isLoggedIn: isAuthenticated, profile: { name: user && user.name, email: user && user.email, picture: user && user.picture}}));
    }
  }, [isLoggedIn]);

  // Handle profile form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User details submitted:", userDetails);
    setShowModal(false);
  };

  return (
    <div className="App">
      {/* Navbar */}
      <CustomNavbar
        user={user}
        auth0Id={jwt}
        isAuthenticated={isAuthenticated}
        logout={logout}
        showModal={showModal}
        setShowModal={setShowModal}
      />


      <UserProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        handleSubmit={handleSubmit}
      />
      <ToastContainer />
    <FeaturePage />
    </div>
  );
}

export default App;
