import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../src/assets/assets";
import { StoreContext } from "../Foods/StoreContext";

const FoodItem = ({
  id,
  image,
  name,
  desc,
  price,
  calories ,
  proteins ,
}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  console.log("FoodItem Props:", { id, name, calories, proteins });
  // ✅ Check if values are now appearing

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} alt="Remove item" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} alt="Add more" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
        </div>

        <div className="nutrition">
          <p>
            <strong>Calories:</strong> {calories} kcal
          </p>
          <p>
            <strong>Proteins:</strong> {proteins} 
          </p>
        </div>

        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
