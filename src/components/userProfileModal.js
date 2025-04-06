import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../redux/services/userAPI';
import { fetchUserData } from '../redux/services/userAPI';
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
    picture: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    }
  });
  useEffect(() => {
    if (user?.profile?._id) {
      debugger
      dispatch(fetchUserData(user.profile._id));
    }
  }, [dispatch, user?.profile?._id]);
  
  useEffect(() => {
    if (profile) {
      debugger
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
        gender: profile.gender || '',
        picture: profile.picture || '',
        shippingAddress: profile.shippingAddress || {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        }
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (['line1', 'line2', 'city', 'state', 'zip', 'country'].includes(name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        shippingAddress: {
          ...prevFormData.shippingAddress,
          [name]: value
        }
      }));
    } else {
      if (name === 'mobile' && !mobileRegex.test(value)) {
        setValidationErrors({ ...validationErrors, mobile: 'Please enter a valid 10-digit mobile number' });
      } else {
        setValidationErrors({ ...validationErrors, mobile: '' });
      }
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
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
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold">Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                <Image
                  src={formData.picture || 'https://via.placeholder.com/150'}
                  roundedCircle
                  fluid
                  className="mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
            </Col>

            <Col md={8}>
              <h5 className="mb-4">Personal Information</h5>
              
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="formMobile" className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.mobile}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.mobile}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formGender" className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              <h5 className="mb-4">Shipping Address</h5>

              <Form.Group controlId="formAddressLine1" className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123 Main St"
                  name="line1"
                  value={formData.shippingAddress?.line1 || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formAddressLine2" className="mb-3">
                <Form.Label>Apt, Suite, etc.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apartment, studio, or floor"
                  name="line2"
                  value={formData.shippingAddress?.line2 || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group controlId="formCity" className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.shippingAddress?.city || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formState" className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={formData.shippingAddress?.state || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formZip" className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip"
                      value={formData.shippingAddress?.zip || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formCountry" className="mb-4">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.shippingAddress?.country || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={handleClose}
              className="px-4"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              className="px-4"
              style={{
                backgroundColor: 'rgb(25, 135, 84)',
                borderColor: 'rgb(25, 135, 84)',
                ':hover': {
                  backgroundColor: 'rgb(20, 110, 69)',
                  borderColor: 'rgb(20, 110, 69)'
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UserProfileModal;