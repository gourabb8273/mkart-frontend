import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { CreditCard, GeoAlt, CalendarCheck } from "react-bootstrap-icons";

const PAYMENT_MODE_UPI = "UPI";
const PAYMENT_MODE_CARD = "Card";
const PAYMENT_MODE_COD = "Cash on Delivery";
const PaymentModal = ({ show, handleClose, onConfirm, totalAmount }) => {
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODE_UPI);
  const shippingAddress = useSelector(
    (state) => state.user.profile?.shippingAddress || {}
  );

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
        <h5 className="text-center mb-4">
          Total Amount: <strong>${totalAmount.toFixed(2)}</strong>
        </h5>
        <Form>
          <Form.Group controlId="paymentMode" className="mb-4">
            <Form.Label className="fw-semibold">Select Payment Mode:</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              <Form.Check
                type="radio"
                name="paymentMode"
                id="upi"
                value={PAYMENT_MODE_UPI}
                label={<span>UPI</span>}
                checked={paymentMode === PAYMENT_MODE_UPI}
                onChange={handlePaymentModeChange}
              />
              <Form.Check
                type="radio"
                name="paymentMode"
                id="card"
                value={PAYMENT_MODE_CARD}
                label={<span>Card</span>}
                checked={paymentMode === PAYMENT_MODE_CARD}
                onChange={handlePaymentModeChange}
              />
              <Form.Check
                type="radio"
                name="paymentMode"
                id="cod"
                value={PAYMENT_MODE_COD}
                label={<span>Cash on Delivery</span>}
                checked={paymentMode === PAYMENT_MODE_COD}
                onChange={handlePaymentModeChange}
              />
            </div>
            <small className="text-muted d-block mt-2 ms-1">
              <CreditCard className="me-1" /> Payment will be securely handled
              via Stripe gateway.
            </small>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <GeoAlt className="me-1 mb-1" /> Shipping Address:
            </Form.Label>
            <div className="border rounded p-3 bg-light">
              <div className="fw-semibold">
                {[shippingAddress.line1, shippingAddress.line2]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {[
                  shippingAddress.city,
                  shippingAddress.state,
                  shippingAddress.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {shippingAddress.country}
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <CalendarCheck className="me-1 mb-1" /> Estimated Delivery:
            </Form.Label>
            <div className="text-success">
              {estimatedDeliveryDate.toDateString()} (within 3 days)
            </div>
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
