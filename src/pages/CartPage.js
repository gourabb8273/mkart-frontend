import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Plus, Dash } from "react-bootstrap-icons";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";
import {
  removeCartItem,
  updateCartItemQuantity,
  markCartItemsAsOrdered,
} from "../redux/services/cartAPI";
import { addOrder } from "../redux/services/orderAPI";
import { showNotification } from "../components/NotificationMessage";
import PaymentModal from "../components/PaymentModal";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { updateProductStock } from '../redux/services/inventoryAPI'; 
import { updateProduct } from "../redux/slices/productSlice"

const EMPTY_CART_MESSAGE = "Your cart is empty.";
const BACK_TO_PRODUCTS_TEXT = "Back to Products";
const CART_TITLE = "Cart";
const PRICE_LABEL = "Price: $";
const SUBTOTAL_LABEL = "Subtotal: $";
const TOTAL_LABEL = "Total: $";
const PROCEED_TO_CHECKOUT_TEXT = "Proceed to Checkout";
const ORDER_SUCCESS = "Order placed successfully";
const ORDER_FAILURE = "Failed to place order";

function CartPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const productList = useSelector((state) => state.products.products);
  const userId = useSelector((state) => state.user.profile?._id);

  const mergedCart = cartItems.map((item) => {
    const product = productList.find((p) => p._id === item.productId);
    return {
      ...item,
      name: product?.name || "Unnamed Product",
      price: product?.price || 0,
      image: product?.images?.[0]?.url || "",
    };
  });

  const handleIncrease = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item && userId) {
      const newQuantity = item.quantity + 1;
      try {
        await updateCartItemQuantity({
          userId,
          productId,
          quantity: newQuantity,
        });
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDecrease = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item || !userId) return;

    if (item.quantity === 1) {
      try {
        await removeCartItem({ userId, productId });
        dispatch(removeFromCart({ productId }));
      } catch (error) {
        console.error(error);
      }
    } else {
      const newQuantity = item.quantity - 1;
      try {
        await updateCartItemQuantity({
          userId,
          productId,
          quantity: newQuantity,
        });
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      } catch (error) {
        console.error(error);
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
      products: mergedCart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: totalPrice,
      paymentMode,
      shippingAddress,
    };
    try {
      await addOrder(orderData);
      for (const item of mergedCart) {
        const currentStock = item.stockCount || 0;
        const newStockCount = Math.max(0, currentStock - item.quantity); 
      
        await updateProductStock({
          productId: item.productId,
          stockCount: newStockCount,
          updatedBy: userId,
        });
      
        dispatch(updateProduct({ ...item, stockCount: newStockCount }));
      }
      
      const cartIds = cartItems.map((item) => item._id);
      await markCartItemsAsOrdered(cartIds);

      showNotification(ORDER_SUCCESS, "success");
      setShowPaymentModal(false);
      dispatch(clearCart());
      history.push("/orders");
    } catch (error) {
      console.error(error);
      showNotification(ORDER_FAILURE, "error");
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
          {CART_TITLE}
        </Typography>
      </Box>

      {mergedCart.length === 0 ? (
        <>
          <p className="text-center">{EMPTY_CART_MESSAGE}</p>
          <Button variant="outline-secondary" onClick={() => history.push("/")}>
            {BACK_TO_PRODUCTS_TEXT}
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
                        style={{ maxHeight: "160px", objectFit: "contain" }}
                      />
                    )}
                  </Col>
                  <Col xs={12} md={8}>
                    <h5>{item.name}</h5>
                    <p className="mb-1">
                      {PRICE_LABEL}
                      {item.price.toFixed(2)}
                    </p>
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
                      {SUBTOTAL_LABEL}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))}

            <div className="text-end">
              <h5>
                {TOTAL_LABEL}
                {totalPrice?.toFixed(2)}
              </h5>
              <Button
                variant="success"
                className="me-2"
                onClick={() => setShowPaymentModal(true)}
              >
                {PROCEED_TO_CHECKOUT_TEXT}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => history.push("/")}
              >
                {BACK_TO_PRODUCTS_TEXT}
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
