import React, { useState } from 'react'
import { View, Button } from 'react-native'
import {
    Container,
    Header,
    Content,
    ListItem,
    Text,
    Radio,
    Right,
    Left,
    Picker,
    Icon,
    Body,
    Title
} from 'native-base';
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
const methods = [
    { name: 'Cash on Delivery', value: 1 },
    { name: 'Bank Transfer', value: 2 },
    { name: 'Card Payment', value: 3 }
]

const paymentCards = [
    { name: 'Wallet', value: 1 },
    { name: 'Visa', value: 2 },
    { name: 'MasterCard', value: 3 },
    { name: 'Other', value: 4 }
]

const Payment = (props) => {


    const order = props.route.params;

    const [selected, setSelected] = useState();
    const [card, setCard] = useState();
    return (
        <Container>
            <Header>
                <Body>
                    <Title>Choose your payment method</Title>
                </Body>
            </Header>
            <Content>
                {methods.map((item, index) => {
                    return (
                        <ListItem key={item.name} onPress={() => setSelected(item.value)}>
                            <Left>
                                <Text>{item.name}</Text>
                            </Left>
                            <Right>
                                <Radio selected={selected == item.value} />
                            </Right>
                        </ListItem>
                    )
                })}
                {selected == 3 ? (
                    <Picker
                        mode="dropdown"
                        style={{ height: 50, width: 150 }}
                        iosIcon={<Icon name={"arrow-down"} />}
                        headerStyle={{ backgroundColor: 'orange' }}
                        headerBackButtonTextStyle={{ color: '#fff' }}
                        headerTitleStyle={{ color: '#fff' }}
                        selectedValue={card}
                        onValueChange={(x) => setCard(x)}
                    >
                        {paymentCards.map((c, index) => {
                            return <Picker.Item
                                key={c.name}
                                label={c.name}
                                value={c.name} />
                        })}
                    </Picker>
                ) : null}
                <View style={{ marginTop: 60, alignSelf: 'center' }}>
                    <Button
                        title={"Confirm"}
                        onPress={() => {
                            props.clearCart();
                            Toast.show({
                                topOffset: 60,
                                type: "success",
                                text1: `Notification Sent`,
                                text2: "Waiter is Comming to Complete Your Payment"
                            })
                            props.navigation.navigate("Cart");
                        }} />
                </View>
            </Content>
        </Container>
    )
}
const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};
export default connect(null, mapDispatchToProps)(Payment);