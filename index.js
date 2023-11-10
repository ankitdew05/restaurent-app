/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Provider as ReduxProvider } from "react-redux";
import App from './App';
import { name as appName } from './app.json';

const Root = () => (
    <App />
);

AppRegistry.registerComponent(appName, () => Root);
