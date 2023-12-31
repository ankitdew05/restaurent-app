import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Login from '../Screens/User/Login'
import Register from '../Screens/User/Register'
import UserProfile from '../Screens/User/UserProfile'
import CartContainer from '../Screens/Cart/CartContainer'


const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Login'
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='LogintoCart'
                component={CartContainer}
                options={{
                    headerShown : false,
                }}
            />
            <Stack.Screen 
                name='Registre'
                component={Register}
                options={{
                    headerShown: false,
                }}
            />
            
            <Stack.Screen 
                name='User Profile'
                component={UserProfile}
                options={{
                    headerShown: true,
                }}
            />
            
            
        </Stack.Navigator>
    )
}

export default function UserNavigator() {
    return <MyStack />;
}