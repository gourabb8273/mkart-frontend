import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Plus, Dash } from 'react-bootstrap-icons';
import { updateQuantity, removeFromCart, clearCart} from '../redux/slices/cartSlice';
import { removeCartItem, updateCartItemQuantity } from '../redux/services/cartAPI';
import PaymentModal from './PaymentModal';
import { addOrder } from '../redux/services/orderAPI';
import { showNotification } from './notification';
import { markCartItemsAsOrdered } from '../redux/services/cartAPI';
import { FaArrowLeft } from "react-icons/fa";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react"; 

function CartPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const productList = useSelector((state) => state.products.products);
  const userId = useSelector((state) => state.user.profile?._id);

  const mergedCart = cartItems.map(item => {
    const product = productList.find(p => p._id === item.productId);
    return {
      ...item,
      name: product?.name || 'Unnamed Product',
      price: product?.price || 0,
      image: product?.images?.[0]?.url || '',
    };
  });

  const handleIncrease = async (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item && userId) {
      const newQuantity = item.quantity + 1;
      try {
        await updateCartItemQuantity({ userId, productId, quantity: newQuantity });
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const handleDecrease = async (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item || !userId) return;
  
    if (item.quantity === 1) {
      try {
        await removeCartItem({ userId, productId });
        dispatch(removeFromCart({ productId }));
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    } else {
      const newQuantity = item.quantity - 1;
      try {
        await updateCartItemQuantity({ userId, productId, quantity: newQuantity });
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const totalPrice = mergedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const handleConfirmPayment = async ({ paymentMode, shippingAddress }) => {
    const orderData = {
      userId,
      products: mergedCart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: totalPrice,
      paymentMode: paymentMode, 
      shippingAddress,
    };

    try {
      await addOrder(orderData);
      const cartIds = cartItems.map(item => item._id);
      await markCartItemsAsOrdered(cartIds);
      dispatch(clearCart());
  
      showNotification("Order placed successfully", "success");
      setShowPaymentModal(false);
      history.push('/');
    } catch (error) {
      console.error("Error placing order:", error);
      showNotification("Failed to place order", "error");
    }
  };

  return (
    <Container className="py-4">
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
      <IconButton
        onClick={() => history.push("/")}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <ArrowLeft size={20} /> 
      </IconButton>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: { xs: "0.5rem", sm: "1.5rem" }, fontWeight: 400 }}
      >
        Cart
      </Typography>
    </Box>
      {mergedCart.length === 0 ? (
        <>
          <p className="text-center">Your cart is empty.</p>
          <Button variant="outline-secondary" onClick={() => history.push('/')}>
            Back to Products
          </Button>
        </>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            {mergedCart.map((item, idx) => (
              <Card className="shadow-sm mb-4 p-3" key={idx}>
                <Row className="align-items-center">
                  <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        style={{ maxHeight: '160px', objectFit: 'contain' }}
                      />
                    )}
                  </Col>
                  <Col xs={12} md={8}>
                    <h5>{item.name}</h5>
                    <p className="mb-1">Price: ${item.price.toFixed(2)}</p>
                    <div className="d-flex align-items-center mb-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDecrease(item.productId)}
                      >
                        <Dash />
                      </Button>
                      <span className="mx-3 fw-semibold">{item.quantity}</span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleIncrease(item.productId)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <p className="mb-0 fw-semibold">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))}
  
            {/* Footer Actions */}
            <div className="text-end">
              <h5>Total: ${totalPrice.toFixed(2)}</h5>
              <Button
                variant="success"
                className="me-2"
                onClick={() => setShowPaymentModal(true)}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => history.push('/')}
              >
                Back to Products
              </Button>
            </div>
          </Col>
        </Row>
      )}
      <PaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        totalAmount={totalPrice}
        onConfirm={handleConfirmPayment}
      />
    </Container>
  );
}

export default CartPage;
