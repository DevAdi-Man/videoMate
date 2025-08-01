import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <NavigationContainer>
                    <RootNavigator />
                    <StatusBar style='auto' />
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

