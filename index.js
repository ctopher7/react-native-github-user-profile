/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './navigation';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens'

enableScreens(true)
AppRegistry.registerComponent(appName, () => App);
