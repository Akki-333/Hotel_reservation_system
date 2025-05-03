import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import "../styles/Home.css";
import FoodItem from "../Foods/FoodItem";
import { StoreContext } from "../Foods/StoreContext";
import src from "../../src/assets/Reservations.jpg";

const HomePage = () => {
  const [category, setCategory] = useState("All");
  const { food_list } = useContext(StoreContext);

  return (
    <div>
      {/* Carousel Section */}
      <div className="container">
        <Carousel>
          {["Welcome to Our Hotel", "Book Your Stay Now"].map(
            (title, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={src} alt={title} />

                <Carousel.Caption className="carousel-text">
                  <h3>{title}</h3>
                  <p>
                    {index === 0
                      ? "Experience luxury and comfort."
                      : "Best deals available."}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            )
          )}
        </Carousel>
      </div>

      {/* Hotel Content */}
      <div className="container text-center my-5">
        <h2>Discover Our Hotel</h2>
        <p>
          Our hotel offers premium rooms, fine dining, and world-class amenities
          to make your stay unforgettable.
        </p>
      </div>

      {/* Explore Menu Section */}
      <div className="explore-menu" id="explore-menu">
        <h1>Explore our menu</h1>
        <p className="explore-menu-text">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <div className="explore-menu-list"></div>
        <hr />
      </div>

      {/* Food Display Section */}
      <div className="food-display" id="food-display">
        <h2> Delicious Dishes</h2>
        <div className="food-display-list">
          {food_list.map((item) =>
            category === "All" || category === item.food_category ? (
              <FoodItem
                key={item.food_id}
                image={item.food_image}
                name={item.food_name}
                desc={item.food_desc}
                price={item.food_price}
                id={item.food_id}
                calories={item.food_calories} // ✅ Add this
                proteins={item.food_proteins}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
