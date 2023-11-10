import React, { useEffect, useState, useContext } from "react";
import { Text, View, Button, Dimensions, ScrollView, Alert } from "react-native";
import { Item, Picker } from "native-base";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Icon from "react-native-vector-icons/MaterialIcons";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";

import AuthGlobal from "../../../Context/store/AuthGlobal";
import Error from "../../../Shared/Error";
import { connect } from "react-redux";
import axios from "axios";
import baseURL from "../../../assets/baseUrl";

const countries = require("../../../assets/countries.json");

const Checkout = (props) => {
  const context = useContext(AuthGlobal)
  const [orderItems, setOrderItems] = useState();
  const [error, setError] = useState();
  const [friendCode, setFriendCode] = useState(null);
  const [code, setcode] = useState("");
  const [user, setUser] = useState();
  const [table, settable] = useState("");
  const [friendorder, setFriendOrder] = useState([])
  const [codecheckout, setCodeCheckout] = useState("")
  const [orderId, setOrderId] = useState()
  useEffect(() => {
    setOrderItems(props.cartItems);
    if (context.stateUser.isAuthenticated === true) {
      setUser(context.stateUser.user.userId);
    } else {
      props.navigation.navigate('Login');
    }
    return () => {
      setOrderItems();
    };
  }, [context.stateUser.isAuthenticated]);

  const confirmOrder = () => {

    let order = {
      dateOrdered: Date.now(),
      //orderItems,
      status: "3",
      user,
    };
    axios.post(`${baseURL}orders`, order).then((res) => {
      if (res.status == 200 || res.status == 201) {
        alert("Friend Code Generated")
        console.log("OrderCreated", res.data)
        setFriendCode(res.data.friendCode)
        setOrderId(res.data.id)
      }
    })
      .catch((error) => {
        console.log("ConfirmError", error.response.data)
        alert("Error to Send Order", error.response.data)
      })


  };

  const checkOut = () => {
    if (code === "" || table === " ") {
      setErrorWithTimeout("Please fill in your credentials");
    } else {
      let order = {
        dateOrdered: Date.now(),
        code,
        orderItems,
        status: "3",
        user,
        orderId,
        table
      };
      props.navigation.navigate("Confirm", { order: order , isFriend : false });
    }
  };

  const friendcheckOut = async () => {
    await axios
      .get(`${baseURL}orders/friendCheckout/${codecheckout}`)
      .then((res) => {
        const data = res.data;
        setFriendOrder(data);
        data.orderId = res.data.id;
        data.orderItems = [...orderItems];
        console.log("data", data)
        let order = { ...data }
        props.navigation.navigate("Confirm", { order: order , isFriend : true });
      })
      .catch((error) => {
        console.log(error)
        Alert("Code is Wrong")
      })


  };
  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  }
  return (
    <ScrollView>
      <FormContainer title={"Serving Address"}>
        <Input
          placeholder={"Waiter Code"}
          name={"code"}
          value={code}
          keyboardType={"numeric"}
          onChangeText={(text) => setcode(text)}
        />
        {error ? <Error message={error} /> : null}
        <Input
          placeholder={"Table Number"}
          name={"table"}
          value={table}
          keyboardType={"numeric"}
          onChangeText={(text) => settable(text)}
        />
        { }
        {error ? <Error message={error} /> : null}
        <View style={{ width: "80%", alignItems: "center" }}>
          {friendCode != null ? (<Button title="Confirm" onPress={() => {
            checkOut()
          }} />) : null}
          {friendCode != null ? (<Text style={{ fontSize: 22, fontWeight: "semibold", margin: 20 }}>Friend Code : {friendCode}</Text>) : null}
          {friendCode == null ? (<Button title="Generate Friend Code" onPress={() => {
            confirmOrder()
          }} />) : null}
        </View>
      </FormContainer>

      <FormContainer title={"Checkout with Friend Code"}>
        <Input
          placeholder={"Friend Code"}
          name={"code"}
          value={codecheckout}
          keyboardType={"numeric"}
          onChangeText={(text) => setCodeCheckout(text)}
        />
        {error ? <Error message={error} /> : null}
        <View style={{ width: "80%", alignItems: "center" }}>
          <Button title="Confirm" onPress={() => {
            friendcheckOut()
          }} />

        </View>
      </FormContainer>
    </ScrollView>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

export default connect(mapStateToProps)(Checkout);
