import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import ProductCard from "./ProductCard";

var { width, height } = Dimensions.get("window");

const ProductList = (props) => {
 
  const { item, isAnkit } = props;
  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={() => {
        if (isAnkit == "true") {
          props.navigation.navigate("AdminSingleChat", { item: item })
        } else {
          props.navigation.navigate("Single Product", { item: item })
        }
      }

      }
    >
      <View
        style={{
          width: width,
          backgroundColor: "gainshboro",
          paddingTop: 15,
        }}
      >
        <ProductCard {...props} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductList;
