import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Change this to your icon library

const MenuModal = (props) => {
    return (
        <Modal
            visible={props.isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={props.onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.menuContainer}>
                    <TouchableOpacity onPress={props.onClose}>
                        <Icon name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <ScrollView style={styles.menuItemsContainer}>
                        {props.categories.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    //console.log(item.id)
                                    props.categoryFilter(item.id),
                                    props.setActive(props.categories.indexOf(item));
                                    props.onClose();
                                }}
                            >
                                <View style={styles.menuItemRow}>
                                    <Text style={styles.menuItemText}>{item.name}</Text>
                                    <Text style={styles.menuItemCount}>5 </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView >
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        height: 300,
        margin : 40,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    menuItemsContainer: {
        height: 300,
        marginTop: 20,
        paddingHorizontal : 40
        
    },
    menuItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuContainer: {
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 20,
    },
    menuItemText: {

        fontWeight : "bold",
        color: "white",
        fontSize: 18,
        paddingVertical: 10,
    },
    menuItemCount: {
        fontWeight : "bold",
        color: "white",
        fontSize: 18,
        paddingVertical: 10,
    },

});

export default MenuModal;
