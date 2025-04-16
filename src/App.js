import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveUserData } from "./redux/services/userAPI";
import Navbar from "./components/Navbar";
import FeaturePage from "./pages/ProductPage";
import ProductPage from "./pages/ProductDetailsPage"; 
import CartPage from "./pages/CartPage"; 
import UserProfileModal from "./components/ProfileModal";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { logoutUser } from "./redux/slices/userSlice";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
  const { user, isAuthenticated, logout } = useAuth0();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    auth0Id: user && user.sub,
    isLoggedIn: isAuthenticated,
    profile: {
      name: user && user.name,
      email: user && user.email,
      picture: user && user.picture,
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const storedUserId = localStorage.getItem("auth0Id");
      if (storedUserId !== user.sub) {
        dispatch(
          saveUserData({
            role: "User",
            auth0Id: user.sub,
            isLoggedIn: isAuthenticated,
            profile: {
              name: user.name,
              email: user.email,
              picture: user.picture,
            },
          })
        );
        localStorage.setItem("auth0Id", user.sub); 
      }
    }
  }, [isAuthenticated, dispatch, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };
  
  const purgeUserPersistedState = () => {
    const persistState = localStorage.getItem("persist:root");
    if (persistState) {
      const parsed = JSON.parse(persistState);
      delete parsed.user;
      localStorage.setItem("persist:root", JSON.stringify(parsed));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    purgeUserPersistedState();
    localStorage.clear();
    logout({ returnTo: window.location.origin });
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
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
        <Switch>
          <Route exact path="/" component={FeaturePage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart" component={CartPage} /> 
          <Route path="/orders" component={OrderHistoryPage} /> 
        </Switch>
      </div>
    </Router>
  );
}

export default App;
