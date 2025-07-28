import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import ReactStars from "react-stars";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebase"; // Import Firebase db instance

// Header component for reuse
const Header = ({ title }) => (
  <div
    style={{
      backgroundColor: "black",
      color: "red",
      padding: "16px",
      textAlign: "center",
    }}
  >
    <h1>{title}</h1>
  </div>
);

const MovieDetails = ({ isOpen, onClose, movie, onReviewUpdate }) => {
  const [userReview, setUserReview] = useState(""); // User's review input
  const [userRating, setUserRating] = useState(0); // User's rating
  const [movieReviews, setMovieReviews] = useState([]); // Array of all reviews
  const [isMobile, setIsMobile] = useState(false); // Mobile screen detection

  // Fetch review and rating when the movie details dialog opens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile view for small screens
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size on initial load

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (movie && isOpen) {
      const fetchMovieDetails = async () => {
        const movieRef = doc(db, "movies", movie.id);
        const movieDoc = await getDoc(movieRef);
        if (movieDoc.exists()) {
          const movieData = movieDoc.data();
          setUserReview(movieData.userReview || ""); // Set the review if it exists
          setUserRating(movieData.userRating || 0); // Set the rating if it exists
          setMovieReviews(movieData.reviews || []); // Set the list of movie reviews
        }
      };

      fetchMovieDetails();
    }
  }, [movie, isOpen]); // Only fetch data when movie or isOpen changes

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!userReview || userRating === 0) {
      alert("Please provide a review and rating.");
      return;
    }

    const movieRef = doc(db, "movies", movie.id);
    try {
      // Update the movie document with the new review and rating
      await updateDoc(movieRef, {
        userReview: userReview,
        userRating: userRating,
        reviews: [...movieReviews, { review: userReview, rating: userRating }], // Add the new review to the existing reviews array
      });

      console.log("Review and rating saved to Firebase");

      // Update the movie rating in the parent component
      onReviewUpdate(movie.id, userRating);

      setUserReview(""); // Reset the review field
      setUserRating(0); // Reset the rating

      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error saving review and rating:", error);
    }
  };

  if (!movie) {
    return null;
  }

  const { title, image, description, rating, year } = movie;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={true}
      PaperProps={{ style: { backgroundColor: "black", boxShadow: "none" } }}
    >
      <Header title={`Movie Details - ${title}`} />

      <DialogContent
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "16px",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap" // Allow content to wrap on smaller screens
        >
          <img
            src={image}
            alt={title}
            style={{
              width: isMobile ? "50%" : "30%", // Dynamically adjust width for mobile
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
          <div
            style={{
              width: isMobile ? "100%" : "70%", // Adjust width for mobile
              textAlign: "left",
              padding: "0 16px",
              boxSizing: "border-box",
              marginTop: "16px",
              fontSize: "1rem",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#ddd",
              }}
            >
              {title}
            </div>
            <div>
              <strong>Rating:</strong>
              <ReactStars
                size={20}
                half={true}
                value={rating}
                edit={false}
                color1={"#ddd"}
                color2={"red"}
              />
            </div>
            <p>
              <strong>Year:</strong> {year}
            </p>
            <p>
              <strong>Description:</strong> {description}
            </p>
            <TextField
              id="userReview"
              label="Your Review"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              style={{ marginTop: "16px", backgroundColor: "white" }}
            />
            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <strong>Your Rating:</strong>
              <ReactStars
                size={30}
                half={true}
                value={userRating}
                onChange={(newRating) => setUserRating(newRating)}
                color1={"#ddd"}
                color2={"red"}
              />
            </div>
            {/* Display existing reviews */}
            <div style={{ marginTop: "32px" }}>
              <strong>Reviews:</strong>
              <div>
                {movieReviews.length > 0 ? (
                  movieReviews.map((review, index) => (
                    <div key={index} style={{ marginBottom: "16px" }}>
                      <Typography style={{ color: "#ddd" }}>
                        {review.review}
                      </Typography>
                      <ReactStars
                        size={20}
                        half={true}
                        value={review.rating}
                        edit={false}
                        color1={"#ddd"}
                        color2={"red"}
                      />
                    </div>
                  ))
                ) : (
                  <Typography style={{ color: "#ddd" }}>
                    No reviews yet.
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReviewSubmit} color="primary">
          Submit Review
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDetails;
