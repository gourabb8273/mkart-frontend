import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../redux/services/userAPI'; // Redux action to save data

const mobileRegex = /^\d{10}$/;

function UserProfileModal({ show, handleClose }) {
    const dispatch = useDispatch();
    // Access the user data from the store using useSelector
    const user = useSelector((state) => state.user);  // assuming 'profile' holds user data
    const [validationErrors, setValidationErrors] = useState({
        mobile: ''
    });
    const profile = user.profile
    // Initialize form data state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        gender: '',
        picture: ''
    });

    // Effect to set formData with user profile data
    useEffect(() => {
        if (profile) {
            setFormData({
                profile: {
                    name: profile.name || '',
                    email: profile.email || '',
                    mobile: profile.mobile || '',
                    gender: profile.gender || '',
                    picture: profile.picture || ''
                },
                auth0Id: user.auth0Id,
                isLoggedin: user.isLoggedin
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile' && !mobileRegex.test(value)) {
            setValidationErrors({
              ...validationErrors,
              mobile: 'Please enter a valid 10-digit mobile number',
            });
          } else {
            setValidationErrors({
              ...validationErrors,
              mobile: '', // Clear error if valid
            });
          }

        setFormData((prevFormData) => ({
            ...prevFormData,
            profile: {
                ...prevFormData.profile, // Keep existing profile data intact
                [name]: value, // Update the specific field
            },
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validationErrors.mobile) {
            dispatch(saveUserData(formData));
            handleClose();
          }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>User Profile Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            value={formData.profile && formData.profile.name}
                            onChange={handleInputChange}
                            readOnly // Make name read-only
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={formData.profile && formData.profile.email}
                            onChange={handleInputChange}
                            readOnly // Make email read-only
                        />
                    </Form.Group>

                    <Form.Group controlId="formMobile" className="mt-3">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your mobile"
                            name="mobile"
                            value={formData.profile && formData.profile.mobile}
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
                            value={formData.profile && formData.profile.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formPicture" className="mt-3">
                        {/* <Form.Label>Profile Picture URL</Form.Label> */}
                        {/* <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            name="picture"
                            value={formData.profile.picture}
                            onChange={handleInputChange}
                        /> */}
                        {formData.picture && (
                            <div className="mt-2">
                                <img
                                    src={formData.profile & formData.profile.picture}
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
