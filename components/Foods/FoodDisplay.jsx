import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../Foods/FoodItem";
import { StoreContext } from "../Foods/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  console.log("Rendering FoodItem:", name);
  console.log("Calories:", calories, "Proteins:", proteins);
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.food_category) {
             const { food_list } = useContext(StoreContext);
             console.log("Food List in FoodDisplay:", food_list);
             return (
               <FoodItem
                 key={item.food_id}
                 id={item.food_id}
                 image={item.food_image}
                 name={item.food_name}
                 desc={item.food_desc}
                 price={item.food_price}
                 calories={item.food_calories}
                 proteins={item.food_proteins}
               />
             );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
