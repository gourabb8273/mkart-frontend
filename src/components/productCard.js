import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlistClick = () => {
    setIsInWishlist(!isInWishlist); // Toggle wishlist state
  };

  return (
    <Card style={{ width: '16rem' }} className="mb-5">
      {/* Fixed Image Size */}
      <Card.Img
        variant="top"
        src={product.imageUrl}
        style={{ width: '100%', height: '200px', objectFit: 'contain' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <h5>${product.price}</h5>
        
        {/* Add to Wishlist Icon */}
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary">Add to Cart</Button>

          {/* Wishlist Icon */}
          <FaHeart
            size={24}
            onClick={handleWishlistClick}
            style={{
              cursor: 'pointer',
              color: isInWishlist ? 'red' : 'grey',
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
