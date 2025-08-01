import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeNavigator from '../../features/home/navigation';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeNavigator} options={{headerShown:false}}/>
    </Tab.Navigator>
  )
}

export default AppNavigator
