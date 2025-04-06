import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { CreditCard, Truck, GeoAlt, CalendarCheck } from 'react-bootstrap-icons';

const PaymentModal = ({ show, handleClose, onConfirm, totalAmount }) => {
  const [paymentMode, setPaymentMode] = useState('UPI');
  const shippingAddress = useSelector((state) => state.user.profile?.shippingAddress || {});
  const staticAddress = {
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India"
  };

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm({ paymentMode, shippingAddress });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          <CreditCard className="me-2 mb-1" /> Confirm Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <h5 className="text-center mb-4">Total Amount: <strong>${totalAmount.toFixed(2)}</strong></h5>
        <Form>
          <Form.Group controlId="paymentMode" className="mb-4">
            <Form.Label className="fw-semibold">Select Payment Mode:</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              <Form.Check
                type="radio"
                name="paymentMode"
                id="upi"
                value="UPI"
                label={<span>UPI</span>}
                checked={paymentMode === 'UPI'}
                onChange={handlePaymentModeChange}
              />
              <Form.Check
                type="radio"
                name="paymentMode"
                id="card"
                value="Card"
                label={<span>Card</span>}
                checked={paymentMode === 'Card'}
                onChange={handlePaymentModeChange}
              />
              <Form.Check
                type="radio"
                name="paymentMode"
                id="cod"
                value="Cash on Delivery"
                label={<span>Cash on Delivery</span>}
                checked={paymentMode === 'Cash on Delivery'}
                onChange={handlePaymentModeChange}
              />
            </div>
            <small className="text-muted d-block mt-2 ms-1">
              <CreditCard className="me-1" /> Payment will be securely handled via Stripe gateway.
            </small>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <GeoAlt className="me-1 mb-1" /> Shipping Address:
            </Form.Label>
            <div className="border rounded p-3 bg-light">
            <Form.Group className="mb-4">
  <Form.Label className="fw-semibold">
    <GeoAlt className="me-1 mb-1" /> Shipping Address:
  </Form.Label>
  <div className="border rounded p-3 bg-light">
  {[shippingAddress.line1, shippingAddress.line2].filter(Boolean).join(', ')}<br />
    {[shippingAddress.city, shippingAddress.state, shippingAddress.zip].filter(Boolean).join(', ')}<br />
    {shippingAddress.country}
    {/* {[shippingAddress.line1, shippingAddress.line2].filter(Boolean).join(', ')}<br />
    {[shippingAddress.city, shippingAddress.state, shippingAddress.zip].filter(Boolean).join(', ')}<br />
    {shippingAddress.country} */}
  </div>
</Form.Group>
              {/* {staticAddress.line1}, {staticAddress.line2},<br />
              {staticAddress.city}, {staticAddress.state}, {staticAddress.zip},<br />
              {staticAddress.country} */}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <CalendarCheck className="me-1 mb-1" /> Estimated Delivery:
            </Form.Label>
            <div className="text-success">
              {estimatedDeliveryDate.toDateString()} (within 3 days)
            </div>
            <small className="text-muted">Currently based on static data</small>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between px-4">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          Confirm & Pay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
