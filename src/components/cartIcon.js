import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';  
import { Button, Navbar, Nav } from 'react-bootstrap';

const CartWithIcon = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Nav className="ml-auto">
        <Button 
          variant="link" 
          className="text-white d-flex align-items-center"
        >
          <FaShoppingCart size={24} style={{ marginRight: '8px' }} />
          <span>{cartCount}</span>
        </Button>
      </Nav>
    </Navbar>
  );
};

export default CartWithIcon;
