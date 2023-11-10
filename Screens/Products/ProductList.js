import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ModalSingleProduct from "./ModalSingleProduct";

var { width, height } = Dimensions.get("window");

const ProductList = (props) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  const { item } = props;
  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={() =>
        toggleMenu()
        // props.navigation.navigate("Single Product", { item: item })
      }
    >
      <View
        style={{

          width: width,
          backgroundColor: "gainshboro",
          paddingTop: 30,
        }}
      >
        <ProductCard {...item} />
      </View>
      <ModalSingleProduct
        item={item}
        isVisible={isMenuVisible}
        onClose={toggleMenu} />
    </TouchableOpacity>
  );
};

export default ProductList;
