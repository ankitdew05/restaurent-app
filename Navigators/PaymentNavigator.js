import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Pay from '../Screens/Payments/Pay'



const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Payment"
                component={Pay}
                options={{
                    title: "Payment"
                }}
            />
        </Stack.Navigator>
    )
}

export default function PaymentNavigator() {
    return <MyStack />;
}