import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import store from "./Redux/store";
import { Provider as ReduxProvider } from "react-redux";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './src/core/theme';
import Main from "./Navigators/Main";
import Auth from './Context/store/Auth';
import { StripeProvider } from '@stripe/stripe-react-native';
import Header from "./Shared/Header";
import Toast from "react-native-toast-message";
const App = () => {

  return (
    <StripeProvider
      publishableKey="pk_live_51L90PXSEwppErzgo2vwTlstf31qXJUHd4u05w5gCtQClSlf1M8S7daLviT1sPrPsGuB2upYCaB09U2sV8wg7rPj900dzHbuhLy"
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <Auth>
        <ReduxProvider store={store}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              {/* <Header /> */}
              <Main />
              <Toast ref={(ref) => Toast.setRef(ref)} />
            </NavigationContainer>
          </PaperProvider>
        </ReduxProvider>
      </Auth>
    </StripeProvider>



  );
};
export default App;






