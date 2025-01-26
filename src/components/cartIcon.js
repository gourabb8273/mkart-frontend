import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';  // Import the cart icon
import { Button, Navbar, Nav } from 'react-bootstrap';

const CartWithIcon = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Nav className="ml-auto">
        {/* Other nav items */}
        
        <Button 
          variant="link" 
          className="text-white d-flex align-items-center"
        >
          <FaShoppingCart size={24} style={{ marginRight: '8px' }} />
          <span>{cartCount}</span> {/* Cart count */}
        </Button>
      </Nav>
    </Navbar>
  );
};

export default CartWithIcon;
