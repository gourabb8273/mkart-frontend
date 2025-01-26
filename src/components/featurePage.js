// src/pages/FeaturePage.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; 

import ProductCard from '../components/productCard';


const dummyProducts = [
    {
        id: 1,
        name: 'T-shirt',
        description: 'A stylish cotton t-shirt.',
        price: 19.99,
        imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png',
        category: 'Clothing'
    },
    {
        id: 2,
        name: 'Sunglasses',
        description: 'Sunglasses for summer vibes.',
        price: 29.99,
        imageUrl: 'https://hidesign.com/cdn/shop/products/scuba-womens-black-round_1_1024x1024.jpg?v=1715255380',
        category: 'Accessories'
    },
    {
        id: 3,
        name: 'Sunglass',
        description: 'Comfortable Sunglass.',
        price: 49.99,
        imageUrl: 'https://m.media-amazon.com/images/I/51OQ3sPBAsL._AC_UY1100_.jpg',
        category: 'Accessories'
    },
    {
        id: 4,
        name: 'Hat',
        description: 'A trendy hat for summer.',
        price: 15.99,
        imageUrl: 'https://m.media-amazon.com/images/I/81T-W+2GShL._AC_UY1100_.jpg',
        category: 'Accessories'
    },
    {
        id: 1,
        name: 'T-shirt',
        description: 'A stylish cotton t-shirt.',
        price: 19.99,
        imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png',
        category: 'Clothing'
    },
    {
        id: 2,
        name: 'Sunglasses',
        description: 'Sunglasses for summer vibes.',
        price: 29.99,
        imageUrl: 'https://hidesign.com/cdn/shop/products/scuba-womens-black-round_1_1024x1024.jpg?v=1715255380',
        category: 'Accessories'
    },
];

function FeaturePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const handleSearch = () => {
      // Add search functionality
      console.log('Searching for:', searchTerm);
    };
  
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryFilterChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleFilter = () => {
        setFilteredProducts(
            dummyProducts.filter(product =>
                (product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedCategory ? product.category === selectedCategory : true)
            )
        );
    };

    return (
        <Container fluid className="my-0">
            {/* Search and Filters Section */}
            <Row className="mb-0" style={{ backgroundColor: 'lightslategrey', padding: '11px' }}>
      {/* Search Box */}
      <Col sm={6} className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder="Search for products"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="secondary" className="ms-2" onClick={handleSearch}>Search</Button>
      </Col>

      {/* Category Filter */}
      <Col sm={2} className="d-flex align-items-center">
        <Form.Control as="select" value={selectedCategory} onChange={handleCategoryFilterChange}>
          <option value="">Select Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
        </Form.Control>
      </Col>

      {/* Filter Button */}
      <Col sm={1} className="d-flex align-items-center">
        <Button variant="primary" onClick={handleFilter}>Filter</Button>
      </Col>
        <Col  sm={1}>
        </Col>
      {/* Wishlist Icon with Count */}
      <Col sm={1} className="d-flex align-items-center justify-content-end">
        <FaHeart size={24} style={{ marginRight: '8px' }} />
        <span>{wishlistCount}</span>
      </Col>

      {/* Cart Icon with Count */}
      <Col sm={1} className="d-flex align-items-center justify-content-end">
        <FaShoppingCart size={24} style={{ marginRight: '8px' }} />
        <span>{cartCount}</span>
      </Col>
    </Row>

            <div style={{ backgroundColor: 'whitesmoke', padding: '1rem' ,marginBottom: '2rem',marginTop: '0rem'}}>
                {/* Featured Products Section */}
                <h4>Featured Products</h4>
                {/* <Container fluid> */}
                <Row className="g-2">
                    {filteredProducts.map((product) => (
                        <Col sm={2} key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </div>
            {/* </Container> */}
        </Container>
    );
}

export default FeaturePage;
