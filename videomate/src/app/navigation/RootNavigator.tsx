import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppNavigator from './AppNavigator';
import AuthNavigation from '../../features/auth/navigation';

const Stack = createNativeStackNavigator()

const RootNavigator = () => {
    const isLoggedIn = true;
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                isLoggedIn ? (
                    <Stack.Screen name="App" component={AppNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigation} />
                )
            }
        </Stack.Navigator>
    )
}

export default RootNavigator
