import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";
// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";
import axios from "axios";
import baseURL from "../../assets/baseUrl";
const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);
  const register = () => {
    if (email === "") {
      setError("Please fill in the form correctly");
    }
    let user = {
      //name: name,
      email: email,
     // password: password,
     // phone: phone,
      isAdmin: false,
    };

    axios.post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please complete your checkout"

          })
          setTimeout(() => {
            loginUser(user, context.dispatch);
            //props.navigation.navigate('CartContainer')
          }, 500)
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something Went Wrong",
          text2: "Please try again"
        });
      });
  }
  const handleSubmit = () => {
    const user = {
      email,
    };
    if (email === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Login"}>
        <Input
          placeholder={"Enter Email / Mobile No."}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        {/* <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      /> */}
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <EasyButton large primary onPress={() => register()}>
            <Text style={{ color: "white" }}>Login</Text>
          </EasyButton>
        </View>
        {/* <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't have an account yet?</Text>
        <EasyButton
        large
        secondary 
        onPress={() => props.navigation.navigate('Registre')}>
          <Text style={{ color: "white" }}>Register</Text>
        </EasyButton>
      </View> */}
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;