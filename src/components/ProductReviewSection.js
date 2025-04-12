import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge, Spinner, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { fetchReviews, addReview } from "../redux/services/reviewAPI";
import { useParams } from "react-router-dom";

const TEXTS = {
  ratingsAndReviews: "Ratings & Reviews",
  writeAReview: "Write a Review",
  shareExperience: "Share your experience...",
  submitReview: "Submit Review",
  loadingText: "Loading reviews...",
  noReviews: "No reviews available",
  errorLoadingReviews: "Error loading reviews:",
  errorSubmittingReview: "Error submitting review:",
};

const ProductReviewSection = () => {
  const { id: productId } = useParams();
  const profile = useSelector((state) => state.user.profile);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const data = await fetchReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error(TEXTS.errorLoadingReviews, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) return;

    const newReview = {
      userId: profile._id,
      rating,
      userName: profile.name || profile.email,
      comment: reviewText,
    };

    try {
      const saved = await addReview(productId, newReview);
      setReviews((prev) => [saved, ...prev]);
      setReviewText("");
      setRating(0);
    } catch (err) {
      console.error(TEXTS.errorSubmittingReview, err);
    }
  };

  return (
    <Container fluid className="my-5 px-3 px-md-5">
      <Card className="mx-auto p-4 border-0 rounded-2" style={{ backgroundColor: "#e9f7ef", maxWidth: "800px" }}>
        <Card.Body>
          <h4 className="mb-4 text-center">{TEXTS.ratingsAndReviews}</h4>

          {/* Summary */}
          <div className="d-flex flex-column flex-md-row align-items-center mb-4 text-center text-md-start">
            <h1 className="me-md-3 mb-2 mb-md-0">
              {Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0)}
            </h1>
            <div>
              <div className="d-flex justify-content-center justify-content-md-start align-items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={
                      i < reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                        ? "gold"
                        : "#ddd"
                    }
                  />
                ))}
              </div>
              <span className="text-muted">{reviews.length} Reviews</span>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review._id} className="mb-3 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg="success" className="me-2">
                      {review.rating}★
                    </Badge>
                    <strong>{review.comment.slice(0, 30)}...</strong>
                  </div>
                  <Card.Text style={{ whiteSpace: "pre-line" }}>
                    {review.comment}
                  </Card.Text>
                  <small className="text-muted">
                    by {review.userName || "Anonymous"}
                  </small>
                </Card.Body>
              </Card>
            ))
          )}

          {/* Write Review */}
          {profile?._id && (
            <Card className="mt-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">{TEXTS.writeAReview}</h5>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar
                      key={i}
                      color={i <= rating ? "gold" : "#ddd"}
                      style={{ cursor: "pointer", fontSize: "1.5rem" }}
                      onClick={() => setRating(i)}
                    />
                  ))}
                </div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={TEXTS.shareExperience}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="mb-2"
                />
                <div className="text-end">
                  <Button variant="primary" size="sm" onClick={handleSubmit}>
                    {TEXTS.submitReview}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductReviewSection;
