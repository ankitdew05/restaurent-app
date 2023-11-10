import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import CartContainer from '../Screens/Cart/CartContainer';
import CheckoutNavigator from './CheckoutNavigator';
import UserNavigator from './UserNavigator';


const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Cart'
                component={CartContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="Checkout"
                component={CheckoutNavigator}
                options={{
                    title: 'Checkout'
                }}
            />
             <Stack.Screen 
                name="User"
                component={UserNavigator}
                options={{
                    title: 'User'
                }}
            />
            
        </Stack.Navigator>
    )
}

export default function CartNavigator() {
    return <MyStack />;
}