import React from 'react';
import ReduxStore from '../redux'
import {Provider} from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthStack from './AuthStack'
import HomeStack from './HomeStack'

const Stack = createStackNavigator();

export default () => (
    <Provider store = {ReduxStore}>
        <NavigationContainer>
            <Stack.Navigator 
            initialRouteName={'AuthStack'}
            screenOptions={{headerShown:false,gestureEnabled:false}}
            >
                <Stack.Screen name={'AuthStack'} component={AuthStack}/>
                <Stack.Screen name={'HomeStack'} component={HomeStack}/>
            </Stack.Navigator>
        </NavigationContainer>
    </Provider>
)
