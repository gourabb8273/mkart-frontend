import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setError, setStatus } from "../redux/slices/productSlice";
import { setCartItems } from "../redux/slices/cartSlice";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { getWatchlistData } from "../redux/services/watchlistAPI";
import { getCartItems } from "../redux/services/cartAPI";
import { useHistory } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CATELOG_API_BASE_URL;

const SEARCH_PLACEHOLDER = "Search products...";
const CATEGORY_ALL = "All Categories";
const CATEGORY_APPAREL = "Apparel";
const CATEGORY_ACCESSORIES = "Accessories";
const WISHLIST_TEXT = "Wishlist";
const CART_TEXT = "Cart";
const LOADING_TEXT = "Loading products...";
const ERROR_TEXT = "Error: ";
const NO_PRODUCTS_FOUND = "No products found.";
const FEATURED = "Featured";
const POPULAR = "Popular";
const ALL = "All";

function ProductPage() {
  const history = useHistory();

  const handleCartClick = () => {
    history.push("/cart");
  };
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart.items);
  const profile = useSelector((state) => state.user.profile) || {};
  const watchlist = useSelector((state) => state.user.watchlist) || [];
  const { _id } = profile;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [filterType, setFilterType] = useState(ALL);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  useEffect(() => {
    if (_id) dispatch(getWatchlistData(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    setWishlistCount(watchlist.length);
  }, [watchlist]);

  useEffect(() => {
    const fetchCart = async () => {
      if (_id) {
        try {
          const cartData = await getCartItems(_id);
          dispatch(setCartItems(cartData));
        } catch (err) {
          console.error("Failed to load cart data");
        }
      }
    };
    fetchCart();
  }, [_id, dispatch]);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setStatus("loading"));
      try {
        let queryParams = [];
        if (filterType === FEATURED) queryParams.push("featured=true");
        else if (filterType === POPULAR) queryParams.push("popular=true");
        if (selectedCategory !== ALL)
          queryParams.push(`category=${selectedCategory}`);
        if (searchTerm.trim())
          queryParams.push(`search=${encodeURIComponent(searchTerm.trim())}`);
        const url = `${API_BASE_URL}/products${
          queryParams.length ? `?${queryParams.join("&")}` : ""
        }`;
        const response = await axios.get(url);
        dispatch(setProducts(response.data));
      } catch (err) {
        dispatch(setError(ERROR_TEXT));
      }
    };

    const debounceHandler = setTimeout(() => {
      if (!showWishlistOnly) fetchProducts();
    }, 200);

    return () => clearTimeout(debounceHandler);
  }, [dispatch, filterType, selectedCategory, searchTerm, showWishlistOnly]);

  useEffect(() => {
    if (showWishlistOnly) {
      const filtered = products.filter((p) =>
        watchlist.some((w) => w.productId === p._id)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [showWishlistOnly, products, watchlist]);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setShowWishlistOnly(false);
    setSelectedCategory(ALL);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setShowWishlistOnly(false);
    setFilterType(ALL);
  };

  const handleWishlistFilter = () => {
    setShowWishlistOnly((prev) => !prev);
    setFilterType(ALL);
    setSelectedCategory(ALL);
  };

  const filterButtons = [
    {
      label: (
        <>
          <FaFilter /> {ALL}
        </>
      ),
      value: ALL,
    },
    { label: FEATURED, value: FEATURED },
    { label: POPULAR, value: POPULAR },
  ];

  return (
    <Container fluid className="p-0 bg-light" style={{ minHeight: "100vh" }}>
      <Row className="m-0 py-2 align-items-center">
        <Col
          xs={12}
          md={8}
          className="d-flex flex-wrap align-items-center gap-2"
        >
          <Form.Control
            type="text"
            placeholder={SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "300px",
              height: "38px",
              fontSize: "15px",
              fontWeight: 500,
              borderColor: "#198754",
              boxShadow: "none",
            }}
          />

          <Form.Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              width: "180px",
              height: "38px",
              borderColor: "#198754",
              boxShadow: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <option value={ALL}>{CATEGORY_ALL}</option>
            <option value="Clothing">{CATEGORY_APPAREL}</option>
            <option value="Accessories">{CATEGORY_ACCESSORIES}</option>
          </Form.Select>

          <div className="d-flex gap-2 flex-wrap">
            {filterButtons.map(({ label, value }) => {
              const isActive = filterType === value;
              return (
                <Button
                  key={value}
                  onClick={() =>
                    value === ALL
                      ? setFilterType(ALL)
                      : handleFilterTypeChange(value)
                  }
                  variant="outline-secondary"
                  className={`px-3 d-flex align-items-center gap-2 fw-semibold ${
                    isActive ? "text-dark" : "text-dark"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: "#f8d63d",
                          borderColor: "#f8d63d",
                          fontSize: "14px",
                          fontWeight: 400,
                        }
                      : {
                          backgroundColor: "white",
                          borderColor: "rgb(25, 135, 84)",
                          fontSize: "14px",
                          fontWeight: 500,
                        }
                  }
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </Col>
        <Col
          xs={12}
          md={4}
          className="d-flex align-items-center justify-content-md-end gap-3 mt-2 mt-md-0"
        >
          <div
            onClick={handleWishlistFilter}
            className="d-flex align-items-center cursor-pointer"
            style={{
              color: wishlistCount > 0 ? "rgb(25, 135, 84)" : "#2c3e50",
            }}
          >
            <FaHeart size={20} className="me-2" />
            <span className="fw-medium">{WISHLIST_TEXT} ({wishlistCount})</span>
          </div>

          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={handleCartClick}
            style={{ color: cartCount > 0 ? "rgb(25, 135, 84)" : "#2c3e50" }}
          >
            <FaShoppingCart size={20} className="me-2" />
            <span className="fw-medium">{CART_TEXT} ({cartCount})</span>
          </div>
        </Col>
      </Row>
      <Container fluid className="p-0 m-0 mx-1">
        {status === "loading" && (
          <div className="text-muted">{LOADING_TEXT}</div>
        )}
        {status === "failed" && (
          <div className="text-danger">{ERROR_TEXT}{error}</div>
        )}
        <div className="d-flex flex-wrap justify-content-start mt-1 gap-0">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <p>{NO_PRODUCTS_FOUND}</p>
            </div>
          )}
        </div>
      </Container>
    </Container>
  );
}

export default ProductPage;
