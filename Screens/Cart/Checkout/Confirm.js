import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/baseUrl";
import { TouchableOpacity } from "react-native-gesture-handler";
import { red300 } from "react-native-paper/lib/typescript/src/styles/themes/v2/colors";
import { useFocusEffect } from "@react-navigation/native";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [updatedOrder, setUpdatedOrder] = useState([])
  const finalOrder = props.route.params;
  const isFriend = props.route.params?.isFriend;
  console.log("FinalORder", finalOrder)
  //console.log(finalOrder.order)
  const confirmOrder = async () => {
    const order = finalOrder.order;
    console.log("FinalORder", order)
    axios.put(`${baseURL}orders/friendEdit/${finalOrder.order.orderId}`, { order, updatedOrder , isFriend }).then((res) => {
      if (res.status == 200 || res.status == 201) {
        alert("Order Added")
        if (isFriend) {
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate('Cart');
          }, 500);
        } else {
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate('Payment');
          }, 500);
        }
      }
    })
      .catch((error) => {
        console.log("ConfirmError", error.response.data)
        alert("Error to Send Order", error.response.data)
      })
  };

  useEffect(() => {
    getOrders();
  }, [props])

  const getOrders = async () => {
    await axios.get(`${baseURL}orders/${finalOrder.order.orderId}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log("getorder", res.data);
          const friendOrder = [];
          const updatedOrder = [...res.data.orderItems]; // Initialize updatedOrder with res.data
          finalOrder.order.orderItems.forEach((value) => {
            updatedOrder.push(value); // Concatenate orderItems to updatedOrder
          });
       
            console.log(updatedOrder)
            setUpdatedOrder(updatedOrder);

        }
      })
      .catch((error) => {
        console.log("Error getorder", error.response.data);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={getOrders}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
          <Icon name="refresh" size={30}></Icon>
        </TouchableOpacity>

        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Witer Code : {finalOrder.order.code}</Text>
              <Text>Table No : {finalOrder.order.table}</Text>
              {/* <Text>City: {finalOrder.order.order.city}</Text>
              <Text>Zip Code: {finalOrder.order.order.zip}</Text>
              <Text>Country: {finalOrder.order.order.country}</Text> */}
            </View>
            <Text style={styles.title}>Item:</Text>
            {updatedOrder.length != 0 && updatedOrder.map((x) => {
              return (
                <ListItem style={styles.listItem} key={x.product.name} avatar>
                  <Left>
                    <Thumbnail source={{ uri: x.product.image }} />
                  </Left>
                  <Body style={styles.body}>
                    <Left>
                      <Text>{x.product.name}</Text>
                    </Left>
                    <Right>
                      <Text>{'\u20B9'} {x.product.price}</Text>
                    </Right>

                  </Body>
                </ListItem>
              );
            })}
          </View>
        ) : null}
        <View style={{ alignItems: "center", margin: 20 }}>
          {isFriend ? (<Button title={"Add"} onPress={() => { confirmOrder() }} />) : (<Button title={"Place order"} onPress={confirmOrder} />)}
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};


const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
