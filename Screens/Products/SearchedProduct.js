import { View, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { Content, Left, Body, ListItem, Thumbnail, Text } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProductCard from "./ProductCard";
import ModalSingleProduct from "./ModalSingleProduct";

var { width } = Dimensions.get("window");

const SearchedProduct = (props) => {
  const { productsFiltered } = props;
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  return (
    <Content style={{ width: width }}>
      {productsFiltered.length > 0 ? (
        productsFiltered.map((item) => (
          <TouchableOpacity
            style={{ width: "100%" }}
            // onPress={() =>
            //   toggleMenu()
            //   // props.navigation.navigate("Single Product", { item: item })
            // }
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
        ))
      ) : (
        <View style={styles.center}>
          <Text style={{ alignSelf: "center" }}>
            No products match the selected criteria
          </Text>
        </View>
      )}
    </Content>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchedProduct;

{/* <ListItem
            onPress={()=>
             props.navigation.navigate("Single Product", {item :item}
             )}
            key={item._id}
            avatar
          >
            <Left>
              <Thumbnail
                source={{
                  uri: item.image
                    ? item.image
                    : "https://www.bigbasket.com/media/uploads/p/s/10000148_30-fresho-onion.jpg",
                }}
              />
            </Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note> {'\u20B9'} {item.price}</Text>
            </Body>
          </ListItem> */}