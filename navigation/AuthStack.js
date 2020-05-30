import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Username from '../screens/AuthStack/Username'
import Password from '../screens/AuthStack/Password'

const Stack = createStackNavigator();

export default () => (
    <Stack.Navigator 
    initialRouteName={'Username'}
    screenOptions={{headerShown:false}}
    >
        <Stack.Screen name={'Username'} component={Username}/>
        <Stack.Screen name={'Password'} component={Password}/>
    </Stack.Navigator>
)
