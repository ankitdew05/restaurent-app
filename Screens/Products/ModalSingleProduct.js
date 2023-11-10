import React from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Change this to your icon library
import { connect } from 'react-redux';
import { useEffect, useState } from "react";
import { Left, Right, Container, H1 } from "native-base";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
const ModalSingleProduct = (props) => {
    const [item, setItem] = useState(props.item);
    const [availability, setAvailability] = useState(null);
    const [availabilityText, setAvailabilityText] = useState("");
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
    useEffect(() => {
        if (props.item.countInStock == 0) {
            setAvailability(<TrafficLight unavailable></TrafficLight>);
            setAvailabilityText("Unavailable");
        } else if (props.item.countInStock <= 5) {
            setAvailability(<TrafficLight limited></TrafficLight>);
            setAvailabilityText("Limited Stock");
        } else {
            setAvailability(<TrafficLight available></TrafficLight>);
            setAvailabilityText("Available");
        }

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        };
    }, []);
    return (
        <Modal
            visible={props.isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={props.onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={{ position: 'absolute', zIndex: 5, top: 15, right: 20 }} onPress={props.onClose}>
                        <Icon name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <ScrollView style={{ marginBottom: 80, padding: 0 }}>

                        <View>
                            <Image
                                source={{
                                    uri: item.image
                                        ? item.image
                                        : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                                }}
                                resizeMode="cover"
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.container}>
                            <View style={styles.constainers}>
                                <Text style={{ marginBottom: 10 }}> 🟢 BestSeller</Text>
                                <Text style={styles.title}>
                                    {item.name.length > 30 ? item.name.substring(0, 15 - 3) + "..." : item.name}
                                </Text>
                                <Text style={styles.price}>{'\u20B9'} {item.price}</Text>
                                {/* <Text style={{ fontSize: 20, marginBottom: 10, color: "yellow" }}>★★★☆☆</Text>
                                <Text styel={styles.detail}>More Detail</Text> */}
                            </View>
                            <View style={styles.constainers}>
                                <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                                    {item.countInStock > 0 ? (
                                        <View style={{ marginHorizontal: 50 }}>
                                            <EasyButton
                                                primary
                                                medium
                                                onPress={() => {
                                                    props.addItemToCart(item),
                                                        Toast.show({
                                                            topOffset: 60,
                                                            type: "success",
                                                            text1: `${item.name} added to cart`,
                                                            text2: "Go to your cart to complete order"
                                                        })
                                                    props.onClose()
                                                }}
                                            >
                                                {count != 0 ? (
                                                    <View style={styles.cartButtonsContainer}>
                                                        <TouchableOpacity onPress={() => props.removeFromCart(item)}>
                                                            <Text style={styles.cartButton}>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.cartQuantity}>{count}</Text>
                                                        <TouchableOpacity onPress={() => {
                                                            props.addItemToCart(item)
                                                            Toast.show({
                                                                topOffset: 60,
                                                                type: "success",
                                                                text1: `${item.name} added to cart`,
                                                                text2: "Go to your cart to complete order"
                                                            })
                                                            props.onClose()
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
                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
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
    overlay: {
        flex: 1,
        // height: 500,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    menuContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 0,
    },
    container: {
        padding: 5,
        //height: 100,
        flex: 2,
        flexDirection: "row",
        elevation: 1,
        backgroundColor: "white",
    },
    title: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 18,
        textAlign: "left",
    },
    price: {
        fontSize: 20,
        textAlign: "left",
        color: "orange",
    },
    constainers: {
        paddingStart: 10,
        padding: 5,
        flex: 1,
        justifyContent: "flex-start"
    },
    imageContainer: {
        backgroundColor: "white",
        padding: 0,
        margin: 0,
    },
    image: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: "100%",
        height: 250,
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    contentHeader: {
        fontWeight: "bold",
        color: "black",
        marginBottom: 20,
    },
    contentText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    bottomContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "white",
    },

    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    availability: {
        flexDirection: "row",
        marginBottom: 10,
    },
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

});

export default connect(mapStateToProps, mapDispatchToProps)(ModalSingleProduct);
