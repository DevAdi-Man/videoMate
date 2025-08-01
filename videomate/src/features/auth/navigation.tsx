import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../app/navigation/types";
import Login from "./screen/Login";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  return (
        <Stack.Navigator screenOptions={{headerShown:false}} >
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
  )
}

export default AuthNavigation;
