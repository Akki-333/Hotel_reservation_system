import { createContext, useState } from "react";
import { food_list as rawFoodList, menu_list } from "../../src/assets/assets";

export const StoreContext = createContext(null);

// ✅ Normalize food_list to ensure all values are defined
const food_list = rawFoodList.map((food) => ({
  ...food,
  food_calories: food.food_calories ?? "N/A",
  food_proteins: food.food_proteins ?? "N/A",
}));

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [ordersData, setOrdersData] = useState({});

  console.log("Food List Data in StoreContextProvider:", food_list);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 0,
    }));
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = food_list.find(
        (product) => product.food_id === Number(itemId)
      );
      return itemInfo ? total + itemInfo.food_price * quantity : total;
    }, 0);
  };

  const getFoodDetails = (itemId) => {
    return (
      food_list.find((product) => product.food_id === Number(itemId)) || {}
    );
  };

  const placeOrder = (deliveryData) => {
    console.log("Order placed with details:", deliveryData);
  };

  const contextValue = {
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getFoodDetails,
    placeOrder,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
