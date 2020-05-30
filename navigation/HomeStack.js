import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/HomeStack/Home'
import Profile from '../screens/HomeStack/Profile'

const Stack = createStackNavigator();

export default () => (
    <Stack.Navigator 
    initialRouteName={'Home'}
    >
        <Stack.Screen name={'Home'} component={Home}/>
        <Stack.Screen name={'Profile'} component={Profile}/>
    </Stack.Navigator>
)
