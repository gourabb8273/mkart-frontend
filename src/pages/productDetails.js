import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Image, Carousel, Badge } from 'react-bootstrap';
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

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Row>
        <Col className="text-start ps-5">
          <Button variant="secondary" onClick={() => history.push('/')} className="mb-4">← Back to Home</Button>
        </Col>
      </Row>
      {product ? (
        <Row className="w-75 mx-auto">
          <Col md={6} className="d-flex flex-column align-items-center">
            <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} className="w-100">
              {product.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <Zoom>
                    <Image src={img.url} alt={product.name} fluid style={{ height: '400px', objectFit: 'contain' }} />
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
          <Col md={6} className="pt-3 d-flex flex-column align-items-center text-center">
            <Card style={{ border: 'none', boxShadow: 'none', width: '100%' }}>
              <Card.Body>
                <Card.Title as="h3" style={{ fontWeight: 'bold' }}>{product.name}</Card.Title>
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <Badge bg="success" style={{ fontSize: '12px', padding: '8px' }}>⭐ 4.2 / 5</Badge>
                  <span className="ms-2 text-muted" style={{ fontSize: '16px' }}>(11,785 Ratings & 1,174 Reviews)</span>
                </div>
                <h4 className="text-success">Special Price ${product.price}</h4>
                <p className="text-muted">M.R.P: <s>${(product.price * 1.35).toFixed(0)}</s> <span className="text-success">(35% Off)</span></p>
                <p><strong>Category:</strong> {product.category}</p>
                <Card.Text>{product.description}</Card.Text>
                <Button variant="primary" size="xs" className="me-3">Buy Now</Button>
                {_id ? (
                  <Button variant="warning" size="xs">Add to Cart</Button>
                ) : (
                  <Button variant="secondary" size="xs" disabled>Add to Cart</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2>Product not found</h2>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductPage;