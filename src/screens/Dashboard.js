import React, { useContext } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import AsyncStorage from "@react-native-async-storage/async-storage"
import AuthGlobal from "../../Context/store/AuthGlobal"

import { logoutUser } from "../../Context/actions/Auth.actions"

export default function Dashboard({ navigation }) {
  const context = useContext(AuthGlobal)
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          [
            AsyncStorage.removeItem("jwt"),
            logoutUser(context.dispatch),
            navigation.navigate('LoginScreen')
          ]
        }
      >
        Logout
      </Button>
    </Background>
  )
}
