import {
  View,
  Text,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
var { width } = Dimensions.get("window");
import Rating from '@mui/material/Rating';
import { yellow } from "@mui/material/colors";
const ProductCard = (props) => {
  console.log("props heree", props.cartItems);
  const [count, setcount] = useState(0)
  useEffect(() => {
    let tempCount = 0; // Initialize the temp count outside the map function

    props.cartItems.forEach((value) => {
      if (value?.product.id === props.id) {
        tempCount += 1; // Increment tempCount for each matching item
      }
    });

    setcount(tempCount);
  }, [props.cartItems]); // Remove .length here

  const { name, price, image, countInStock, id } = props;
  return (
    <View style={styles.container}>
      <View style={styles.constainers}>
        <Text> 🟢 BestSeller</Text>
        <Text style={styles.title}>
          {name.length > 30 ? name.substring(0, 15 - 3) + "..." : name}
        </Text>
        <Text style={styles.price}>{'\u20B9'} {price}</Text>
        <Text style={{ fontSize: 20, marginBottom: 10, color: "yellow" }}>★★★☆☆</Text>
        <Text styel={styles.detail}>More Detail</Text>
      </View>
      <View style={styles.constainers}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{
            uri: image
              ? image
              : "https://www.bigbasket.com/media/uploads/p/s/10000148_30-fresho-onion.jpg",
          }}
        />
        {countInStock > 0 ? (
          <View style={{ position: 'absolute', bottom: 2, marginHorizontal: 50 }}>
            <EasyButton
              primary
              medium
              onPress={() => {
                props.addItemToCart(props),
                  Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: `${name} added to cart`,
                    text2: "Go to your cart to complete order"
                  })
              }}
            >
              {count != 0 ? (
                <View style={styles.cartButtonsContainer}>
                  <TouchableOpacity onPress={() => props.removeFromCart(props)}>
                    <Text style={styles.cartButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.cartQuantity}>{count}</Text>
                  <TouchableOpacity onPress={() => {
                    props.addItemToCart(props)
                    Toast.show({
                      topOffset: 60,
                      type: "success",
                      text1: `${name} added to cart`,
                      text2: "Go to your cart to complete order"
                    })
                  }}>
                    <Text style={styles.cartButton}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={{ color: 'white' }}>Add</Text>
              )}
            </EasyButton>
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}>Currently Unavilable</Text>
        )}
      </View>

    </View>
  );
};
const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (product) => dispatch(actions.removeFromCart(product)),
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  cartButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  cartQuantity: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  container: {
    // width: width / 2 - 20,
    // height: width / 1.7,
    padding: 5,
    height: 175,
    flex: 2,
    flexDirection: "row",
    // borderRadius: 10,
    // marginTop: 55,
    // marginBottom: 5,
    // marginLeft: 10,
    // alignItem: "left",
    elevation: 1,
    backgroundColor: "white",
  },
  detail: {
    backgroundColor: "grey",
    elevation: 8,
  },
  constainers: {
    padding: 5,
    flex: 1,
    justifyContent: "flex-start"
  },
  image: {
    borderRadius: 15,
    width: 175,
    height: 130,
    backgroundColor: "transparent",
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
  },
  price: {
    fontSize: 20,
    textAlign: "left",
    //marginBottom: 10,
    color: "orange",
    marginTop: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
