import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../redux/services/userAPI';

const mobileRegex = /^\d{10}$/;

function UserProfileModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const profile = user.profile;
  
  const [validationErrors, setValidationErrors] = useState({ mobile: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    picture: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
        gender: profile.gender || '',
        picture: profile.picture || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobile' && !mobileRegex.test(value)) {
      setValidationErrors({ ...validationErrors, mobile: 'Please enter a valid 10-digit mobile number' });
    } else {
      setValidationErrors({ ...validationErrors, mobile: '' });
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validationErrors.mobile) {
      dispatch(updateUserData(formData)).then((response) => {
      });
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Profile Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formMobile" className="mt-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.mobile}
            />
            {validationErrors.mobile && (
              <Form.Control.Feedback type="invalid">
                {validationErrors.mobile}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="formGender" className="mt-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPicture" className="mt-3">
            {formData.picture && (
              <div className="mt-2">
                <img
                  src={formData.picture}
                  alt="Profile Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserProfileModal;
