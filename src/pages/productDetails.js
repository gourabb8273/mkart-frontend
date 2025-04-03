import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Image, Carousel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ProductPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const products = useSelector((state) => state.products.products);
  const profile = useSelector((state) => state.user.profile) || {};
  const { _id } = profile;
  const product = products.find((p) => p._id === id);
  const [index, setIndex] = useState(0);

  if (!product) {
    return (
      <Container className="my-4" style={{ textAlign: 'left' }}>
        <Button variant="secondary" onClick={() => history.push('/')}>← Back to Home</Button>
        <h2>Product not found</h2>
      </Container>
    );
  }

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const addToCartButton = (
    <Button
      variant="primary"
      style={{ marginRight: '1rem' }}
      disabled={true}
    >
      Add to Cart
    </Button>
  );

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col style={{ textAlign: 'left' }}>
          <Button variant="secondary" onClick={() => history.push('/')} style={{ marginLeft: 0 }}>← Back to Home</Button>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="d-flex flex-column align-items-center">
          <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} className="w-100">
            {product.images.map((img, idx) => (
              <Carousel.Item key={idx}>
                <Zoom>
                  <Image src={img.url} alt={product.name} fluid style={{ height: '500px', objectFit: 'contain' }} />
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
                style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer', marginRight: '5px', border: index === idx ? '2px solid #007bff' : 'none' }}
                onClick={() => setIndex(idx)}
              />
            ))}
          </div>
        </Col>
        <Col md={5} className="pt-3">
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Card.Body>
              <Card.Title as="h2" style={{ fontWeight: 'bold' }}>{product.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '20px' }}>${product.price}</Card.Subtitle>
              <p><strong>Category:</strong> {product.category}</p>
              <Card.Text>{product.description}</Card.Text>
              {_id ? (
                <Button variant="primary" style={{ marginRight: '1rem' }}>Add to Cart</Button>
              ) : (
                <OverlayTrigger overlay={<Tooltip>Please login to add to cart</Tooltip>}>
                  <span style={{ marginRight: '1rem', display: 'inline-block' }}>
                    {addToCartButton}
                  </span>
                </OverlayTrigger>
              )}
              <Button variant="outline-primary" onClick={() => history.push('/')}>Back</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
