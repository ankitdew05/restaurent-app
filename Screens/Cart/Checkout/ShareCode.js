import React, { useContext, useEffect, useState } from 'react'
import { View, Button, ScrollView } from 'react-native'
import AuthGlobal from '../../../Context/store/AuthGlobal';
import FormContainer from '../../../Shared/Form/FormContainer';
import Input from '../../../Shared/Form/Input';
import Error from "../../../Shared/Error";
import { connect } from "react-redux";

const ShareCode = (props) => {
  const order = props.route.params;
  const context = useContext(AuthGlobal)
  const [orderItems, setOrderItems] = useState();
  const [error, setError] = useState();
  const [friendCode, setFriendCode] = useState(null);
  const [code, setcode] = useState("");
  const [user, setUser] = useState();
  const [table, settable] = useState("");
  const [orderId, setOrderId] = useState()

  useEffect(() => {
    setOrderItems(order.cartItems);
    if (context.stateUser.isAuthenticated === true) {
      setUser(context.stateUser.user.userId);
    } else {
      order.navigation.navigate('Login');
    }
    return () => {
      setOrderItems();
    };
  }, [context.stateUser.isAuthenticated]);


  const checkOut = () => {
    if (code === "" || table === " ") {
      setError("Please fill in your credentials");
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
      props.navigation.navigate("ShareCode", { order: order });
    }
  };
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
        {error ? <Error message={error} /> : null}
        <View style={{ width: "80%", alignItems: "center" }}>
          <Button title="Confirm" onPress={() => {
            checkOut()
          }} />
        </View>
      </FormContainer>
    </ScrollView>
  )
}
const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

export default connect(mapStateToProps)(ShareCode);