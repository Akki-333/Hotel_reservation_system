import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import '../styles/Home.css';

const HomePage = () => {
  return (
    
    <div className="container">
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-facebook-cover-template-design-9b428de1b8b3fe6eca442d4af7a0aa53_screen.jpg?ts=1609753889" alt="First slide" />
          <Carousel.Caption>
            <h3>Welcome to Our Hotel</h3>
            <p>Experience luxury and comfort.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-facebook-cover-template-design-9b428de1b8b3fe6eca442d4af7a0aa53_screen.jpg?ts=1609753889" alt="Second slide" />
          <Carousel.Caption>
            <h3>Book Your Stay Now</h3>
            <p>Best deals available.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      
      {/* Hotel Content */}
      <div className="container text-center my-5">
        <h2>Discover Our Hotel</h2>
        <p>Our hotel offers premium rooms, fine dining, and world-class amenities to make your stay unforgettable.</p>
      </div>
      
 
    </div>
  );
};

export default HomePage;
