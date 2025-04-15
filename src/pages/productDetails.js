import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  ListGroup,
  Col,
  Button,
  Card,
  Image,
  Carousel,
  Badge,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaShoppingCart } from "react-icons/fa";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import ProductReviewSection from "../components/ProductReviewSection";
import PaymentModal from "../components/PaymentModal";
import { showNotification } from "../components/Notification";
import { addItemToCart } from "../redux/services/cartAPI";
import {
  addToCart,
  updateQuantity,
  setCartItems,
} from "../redux/slices/cartSlice";
import { getCartItems } from "../redux/services/cartAPI";
import { addOrder } from "../redux/services/orderAPI";
import { fetchReviews } from "../redux/services/reviewAPI";
import { updateProductStock } from '../redux/services/inventoryAPI'; 
import { updateProduct } from "../redux/slices/productSlice"

const BUY_NOW = "Buy Now";
const ADD_TO_CART = "Add to Cart";
const OUT_OF_STOCK = "Out of Stock";
const IN_CART = "In Cart";

const SellerInfo = () => {
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [pincode, setPincode] = useState('');

  const handleCheck = () => {
    if (pincode.length === 6) {
      setShowDeliveryDate(true);
    }
  };

  return (
    <Container className="p-4 rounded" style={{ maxWidth: '400px' }}>
      <h6 className="text-dark mb-3 text-start fw-bold">Seller</h6>
      
      {/* Seller Policies */}
      <div className="ms-3">
        <div className="d-flex align-items-start mb-2">
          <span className="text-success me-2">•</span>
          <span>7 Days Replacement Policy</span>
        </div>
        <div className="d-flex align-items-start mb-4">
          <span className="text-success me-2">•</span>
          <span>GST invoice available</span>
        </div>
      </div>

      {/* Delivery Date Check */}
      <div className="mb-4">
        <p className="text-secondary mb-2 text-start">Check delivery date</p>
        <div className="d-flex gap-2">
          <input 
            type="text"
            placeholder="Enter PIN code"
            className="form-control"
            style={{ maxWidth: '150px' }}
            maxLength="6"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button 
            className="btn btn-primary px-3"
            onClick={handleCheck}
          >
            Check
          </button>
        </div>
        
        {showDeliveryDate && (
          <div className="mt-3 text-success text-start">
            <i className="fas fa-check-circle me-2"></i>
            Delivery by 20 May 2025
          </div>
        )}
      </div>

      {/* Other Sellers Link */}
      {/* <a href="#" className="text-primary text-decoration-none">
        See other sellers <i className="fas fa-chevron-right ms-1" style={{ fontSize: '0.75rem' }}></i>
      </a> */}
    </Container>
  );
};
const ProductPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const profile = useSelector((state) => state.user.profile) || {};
  const cartItems = useSelector((state) => state.cart.items) || [];
  const { _id: userId } = profile;
  const product = products.find((p) => p._id === id);
  const cartItem = cartItems.find((item) => item.productId === id);
  const quantityInCart = cartItem?.quantity || 0;
  const [cartCount, setCartCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });

  // Function to update the review summary
  const handleSummaryUpdate = (newSummary) => {
    setReviewStats(newSummary);
  };

  useEffect(() => {
    if (userId) {
      getCartItems(userId)
        .then((cartData) => dispatch(setCartItems(cartData)))
        .catch(() => console.error("Failed to fetch cart"));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleBuyNow = () => {
    if (!userId) {
      showNotification("Please log in to proceed", "error");
      return;
    }
    if (product.stock === 0) {
      showNotification("This product is out of stock", "error");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleAddToCart = async () => {
    if (!userId || !product) return;
    const newQuantity = quantityInCart + 1;
    try {
      await addItemToCart({
        userId,
        productId: product._id,
        quantity: newQuantity,
      });
      if (quantityInCart === 0) {
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
      } else {
        dispatch(
          updateQuantity({ productId: product._id, quantity: newQuantity })
        );
      }
      showNotification("Item added to cart", "success");
    } catch (error) {
      console.error("Error adding to cart", error);
      showNotification("Failed to add to cart", "error");
    }
  };

  const handlePaymentConfirm = async ({ paymentMode, shippingAddress }) => {
    const orderData = {
      userId,
      products: [
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image:
            product.images && product.images[0] ? product.images[0].url : "",
          subtotal: product.price,
        },
      ],
      totalAmount: product.price,
      paymentMode,
      shippingAddress,
    };
    try {
      await addOrder(orderData);
      debugger
      const newStockCount = (product.stock || 0) - 1;
      await updateProductStock({
        productId: product._id,
        stockCount: newStockCount,
        updatedBy: userId,
      });
      dispatch(updateProduct({ ...product, stockCount: newStockCount }));
      showNotification("Order placed successfully", "success");
      setShowPaymentModal(false);
      history.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      showNotification("Failed to place order", "error");
    }
  };

  return (
    <Container
      fluid
      className="py-4"
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        onClick={() => history.push("/cart")}
        style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
      >
        <FaShoppingCart
          size={24}
          color={cartCount > 0 ? "rgb(25, 135, 84)" : "#2c3e50"}
        />
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "#f8d63d",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {cartCount}
          </span>
        )}
      </div>

      <Row>
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
            Product Details
          </Typography>
        </Box>
      </Row>

      {product ? (
        <>
          <Row className="w-75 mx-auto">
            <Col md={6} className="d-flex flex-column align-items-center">
              <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                indicators={false}
                className="w-100"
              >
                {product.images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <Zoom>
                      <Image
                        src={img.url}
                        alt={product.name}
                        fluid
                        style={{ height: "400px", objectFit: "contain" }}
                      />
                    </Zoom>
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className="d-flex mt-3">
                {product.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img.url}
                    alt={`Thumbnail ${idx}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      cursor: "pointer",
                      marginRight: "5px",
                      border: index === idx ? "2px solid #007bff" : "none",
                    }}
                    onClick={() => setIndex(idx)}
                  />
                ))}
              </div>
              <div className="mt-4 d-flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBuyNow}
                  disabled={!userId || product.stock === 0}
                >
                  {BUY_NOW}
                </Button>
                {userId ? (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0
                      ? OUT_OF_STOCK
                      : quantityInCart > 0
                      ? `${IN_CART} (${quantityInCart})`
                      : ADD_TO_CART}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled>
                    Add to Cart
                  </Button>
                )}
              </div>
            </Col>
            <Col
              md={6}
              className="pt-3 d-flex flex-column align-items-center text-center"
            >
              <Card
                style={{ border: "none", boxShadow: "none", width: "100%" }}
              >
                <Card.Body>
                  <Card.Title as="h3" style={{ fontWeight: "bold" }}>
                    {product.name}
                  </Card.Title>

                  {/* Review Stats */}
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <Badge
                      bg="success"
                      style={{ fontSize: "12px", padding: "8px" }}
                    >
                      ⭐ {reviewStats.average} / 5
                    </Badge>
                    <span
                      className="ms-2 text-muted"
                      style={{ fontSize: "16px" }}
                    >
                      ({reviewStats.count} Review
                      {reviewStats.count !== 1 && "s"})
                    </span>
                  </div>

                  {/* Other Product Info */}
                  <h4 className="text-success">
                    Special Price ${product.price}
                  </h4>
                  <p className="text-muted">
                    M.R.P: <s>${(product.price * 1.35).toFixed(0)}</s>{" "}
                    <span className="text-success">(35% Off)</span>
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <Card.Text>{product.description}</Card.Text>
                  < SellerInfo />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <ProductReviewSection
            productId={id}
            onSummaryUpdate={handleSummaryUpdate}
          />
        </>
      ) : (
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2>Product not found</h2>
          </Col>
        </Row>
      )}

      <PaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={product ? product.price : 0}
      />
    </Container>
  );
};

export default ProductPage;
