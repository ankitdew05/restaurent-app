import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

const Pay = (props) => {
    const context = useContext(AuthGlobal);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const requestPayment = async () => {
        console.log("CAlled")
        // const response = await fetch('YOUR_SERVER_URL/request_payment', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ amount: AMOUNT_IN_RUPEES, upiId: CUSTOMER_UPI_ID }),
        // });

        // const data = await response.json();

        // return data.response;
    };
    const handlePayment = async () => {
        const paymentRequestUri = await requestPayment();
console.log("Called")
        Linking.openURL(paymentRequestUri);
    };
    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            props.navigation.navigate("User Profile");
        }
    }, [context.stateUser.isAuthenticated]);

    const handleSubmit = () => {
        const user = {
            email,
            password,
        };

        if (email === "" || password === "") {
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
                    placeholder={"Enter Email"}
                    name={"email"}
                    id={"email"}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Enter Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={styles.buttonGroup}>
                    {error ? <Error message={error} /> : null}
                    <EasyButton large primary onPress={() => handleSubmit()}>
                        <Text style={{ color: "white" }}>Login</Text>
                    </EasyButton>
                </View>
                <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
                    <Text style={styles.middleText}>Don't have an account yet?</Text>
                    <EasyButton
                        large
                        secondary
                        onPress={() => handlePayment}>
                        <Text style={{ color: "white" }}>Register</Text>
                    </EasyButton>
                </View>
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

export default Pay;