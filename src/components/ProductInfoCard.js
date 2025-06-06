import React from "react";
import {
  Card,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
  Col,
} from "react-bootstrap";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  addWatchlistItem,
  removeWatchlistItem,
  setWatchlistStatus,
  setWatchlistError,
} from "../redux/slices/userSlice";
import { addToCart, updateQuantity } from "../redux/slices/cartSlice";
import { showNotification } from "./NotificationMessage";
import { addItemToCart } from "../redux/services/cartAPI";

const API_BASE_URL = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;

const ProductInfoCard = ({ product }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile) || {};
  const { _id: userId } = profile;
  const watchlist = useSelector((state) => state.user?.watchlist) || [];
  const cartItems = useSelector((state) => state.cart.items) || [];

  const isInWishlist = watchlist.some((item) => item.productId === product._id);

  const cartItem = cartItems.find((item) => item.productId === product._id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    const action = isInWishlist
      ? axios.delete(`${API_BASE_URL}/users/wishlist/remove`, {
          data: { userId, productId: product._id },
        })
      : axios.post(`${API_BASE_URL}/users/wishlist/add`, {
          userId,
          productId: product._id,
        });

    try {
      dispatch(setWatchlistStatus("loading"));
      const response = await action;
      if (!isInWishlist) {
        dispatch(
          addWatchlistItem(response.data?.data || { productId: product._id })
        );
        showNotification("Product has been added in wishlist!", "success");
      } else {
        dispatch(removeWatchlistItem({ productId: product._id }));
        showNotification("Product has been removed!", "success");
      }
      dispatch(setWatchlistStatus("succeeded"));
    } catch (error) {
      dispatch(
        setWatchlistError(
          error.response?.data?.message ||
            `Failed to ${isInWishlist ? "remove" : "add"} item`
        )
      );
      dispatch(setWatchlistStatus("failed"));
    }
  };

  const handleCardClick = () => {
      history.push(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    const newQuantity = quantityInCart + 1;

    try {
      const res = await addItemToCart({
        userId,
        productId: product._id,
        quantity: newQuantity,
      });
      if (quantityInCart === 0) {
        dispatch(addToCart({ _id: res._id, productId: product._id, quantity: 1 }));
      } else {
        dispatch(
          updateQuantity({ _id: res._id, productId: product._id, quantity: newQuantity })
        );
      }

      showNotification("Item added to cart", "success");
    } catch (error) {
      console.error("Error adding to cart", error);
      showNotification("Failed to add to cart", "error");
    }
  };

  const rank1Image =
    product.images?.find((image) => image.rank === 1)?.url || "";

  return (
    <>
      <style>{`
        @media (min-width: 1200px) {
          .product-col {
            flex: 0 0 20% !important;
            max-width: 20% !important;
          }
        }
      `}</style>
      <Col xs={12} sm={6} md={4} lg={3} className="mb-3 px-2 product-col">
        <Card
          onClick={handleCardClick}
          className="h-100 d-flex flex-column"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            // cursor: product.stock > 0 ? "pointer" : "not-allowed",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Card.Img
              variant="top"
              src={rank1Image}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                mixBlendMode: "multiply",
              }}
            />

            <div className="position-absolute top-0 start-0 w-100 d-flex justify-content-between p-2">
              <div className="d-flex flex-column gap-1">
                {product.featuredTags?.includes("Featured") && (
                  <Badge
                    pill
                    style={{
                      background: "linear-gradient(135deg, #ffe066, #ffd700)",
                      color: "#2b2b2b",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      padding: "4px 8px",
                    }}
                  >
                    FEATURED
                  </Badge>
                )}
                {product.featuredTags?.includes("Popular") && (
                  <Badge
                    pill
                    style={{
                      background: "linear-gradient(135deg, #868e96, #6c757d)",
                      color: "white",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      padding: "4px 8px",
                    }}
                  >
                    POPULAR
                  </Badge>
                )}
              </div>

              {product.stock > 0 && product.stock <= 2 && (
                <Badge
                  pill
                  style={{
                    background: "#e63946",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    padding: "6px 12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Only {product.stock} left!
                </Badge>
              )}
            </div>

            {product.isAssured && (
              <Badge
                pill
                className="position-absolute bottom-0 start-0 m-2"
                style={{
                  background: "#fff",
                  color: "#2874f0",
                  fontSize: "0.65rem",
                  fontWeight: "500",
                  padding: "2px 8px",
                  border: "1px solid #2874f0",
                }}
              >
                ✓ Assured
              </Badge>
            )}
          </div>

          <Card.Body
            className="p-3 pb-0 d-flex flex-column"
            style={{ backgroundColor: "#f5f6f8", minHeight: "140px" }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <h6
                className="mb-1 fw-500 text-truncate"
                style={{ fontSize: "14px", lineHeight: 1.3 }}
              >
                {product.name}
                {product.size && (
                  <span
                    className="text-muted d-block mt-1"
                    style={{ fontSize: "12px" }}
                  >
                    Size {product.size}
                  </span>
                )}
              </h6>
              <FaHeart
                size={18}
                onClick={handleWishlistClick}
                style={{
                  cursor: userId ? "pointer" : "not-allowed",
                  color: isInWishlist ? "#ff4444" : "#ccc",
                  minWidth: "24px",
                }}
              />
            </div>

            {product.features && (
              <div className="text-muted mb-1" style={{ fontSize: "12px" }}>
                {product.features}
              </div>
            )}

            {product.description && (
              <div
                className="text-secondary mt-1"
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {product.description}
              </div>
            )}

            <div className="d-flex align-items-center gap-2 mb-2 mt-2">
              <span className="fw-bold" style={{ fontSize: "16px" }}>
                ${product.price}
              </span>
            </div>

            <OverlayTrigger
              overlay={
                <Tooltip>
                  {product.stock === 0 ? "Out of stock" : "Click to add again"}
                </Tooltip>
              }
            >
              <Button
                variant="primary"
                className="w-100 mb-2"
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !userId}
                style={{
                  borderRadius: "4px",
                  background: '#198754',
                  border: "none",
                  color: 'white',
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FaShoppingCart size={14} />
                {product.stock === 0
                  ? "Out of Stock"
                  : quantityInCart > 0
                  ? `In Cart (${quantityInCart})`
                  : "Add to Cart"}
              </Button>
            </OverlayTrigger>

            <div className="mt-1">
              {product.freeDelivery && (
                <div className="text-success" style={{ fontSize: "12px" }}>
                  Free delivery
                </div>
              )}
              {product.dealTag && (
                <Badge
                  pill
                  className="mt-1"
                  style={{
                    background: "#e63946",
                    color: "white",
                    fontSize: "10px",
                    padding: "4px 8px",
                  }}
                >
                  {product.dealTag}
                </Badge>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default ProductInfoCard;
