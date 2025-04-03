import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setError, setStatus } from '../redux/slices/productSlice';
import axios from 'axios';
import ProductCard from './productCard';
import { getWatchlistData } from '../redux/services/watchlistAPI';

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CATELOG_API_BASE_URL;

function ProductPage() {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const profile = useSelector((state) => state.user.profile) || {};
  const { _id } = profile;
  const watchlist = useSelector((state) => state.user.watchlist) || [];

  useEffect(() => {
    if (_id) dispatch(getWatchlistData(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    setWishlistCount(watchlist.length);
  }, [watchlist]);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setStatus("loading"));
      try {
        let queryParams = [];
        if (filterType === "Featured") queryParams.push("featured=true");
        else if (filterType === "Popular") queryParams.push("popular=true");
        if (selectedCategory !== "All") queryParams.push(`category=${selectedCategory}`);
        if (searchTerm.trim()) queryParams.push(`search=${encodeURIComponent(searchTerm.trim())}`);
        const url = `${API_BASE_URL}/products${queryParams.length ? `?${queryParams.join("&")}` : ''}`;
        const response = await axios.get(url);
        dispatch(setProducts(response.data));
      } catch (err) {
        dispatch(setError("Failed to fetch products"));
      }
    };
    const debounceHandler = setTimeout(() => {
      if (!showWishlistOnly) fetchProducts();
    }, 200);
    return () => clearTimeout(debounceHandler);
  }, [dispatch, filterType, selectedCategory, searchTerm, showWishlistOnly]);

  useEffect(() => {
    if (showWishlistOnly) {
      const filtered = products.filter(p => watchlist.some(w => w.productId === p._id));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [showWishlistOnly, products, watchlist]);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setShowWishlistOnly(false);
    setSelectedCategory('All');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setShowWishlistOnly(false);
    setFilterType('All');
  };

  const handleWishlistFilter = () => {
    setShowWishlistOnly(prev => !prev);
    setFilterType('All');
    setSelectedCategory('All');
  };

  return (
    <Container fluid className="p-0 bg-light" style={{ minHeight: '100vh' }}>
      <Row className="m-0 py-2 align-items-center">
        <Col xs={12} md={8} className="d-flex flex-wrap align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px', height: '38px', borderColor: '#dee2e6' }}
          />
          <Form.Select 
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ width: '180px', height: '38px', borderColor: '#dee2e6' }}
          >
            <option value="All">All Categories</option>
            <option value="Clothing">Apparel</option>
            <option value="Accessories">Accessories</option>
          </Form.Select>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              variant={filterType === 'All' ? 'primary' : 'outline-secondary'}
              onClick={() => setFilterType('All')}
              className="px-3 d-flex align-items-center gap-2"
            >
              <FaFilter /> All
            </Button>
            <Button 
              variant={filterType === 'Featured' ? 'primary' : 'outline-secondary'}
              onClick={() => handleFilterTypeChange('Featured')}
            >
              Featured
            </Button>
            <Button 
              variant={filterType === 'Popular' ? 'primary' : 'outline-secondary'}
              onClick={() => handleFilterTypeChange('Popular')}
            >
              Popular
            </Button>
          </div>
        </Col>
        <Col xs={12} md={4} className="d-flex align-items-center justify-content-md-end gap-3 mt-2 mt-md-0">
          <div 
            onClick={handleWishlistFilter}
            className="d-flex align-items-center cursor-pointer"
            style={{ color: showWishlistOnly ? '#2c3e50' : '#7f8c8d' }}
          >
            <FaHeart size={20} className="me-2" />
            <span className="fw-medium">Wishlist ({wishlistCount})</span>
          </div>
          <div className="d-flex align-items-center" style={{ color: '#2c3e50' }}>
            <FaShoppingCart size={20} className="me-2" />
            <span className="fw-medium">Cart (0)</span>
          </div>
        </Col>
      </Row>
      <Container fluid className="p-0 m-0 mx-1">
        {status === "loading" && <div className="text-muted">Loading products...</div>}
        {status === "failed" && <div className="text-danger">Error: {error}</div>}
        <div className="d-flex flex-wrap justify-content-start mt-1 gap-0">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p>No products found.</p>
            </div>
          )}
        </div>
      </Container>
    </Container>
  );
}

export default ProductPage;
