import { StyleSheet, Text, View } from 'react-native'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
     const [email, setEmail] = useState('');
    const [secure, setSecure] = useState(true);
    return (
        <View style={{ padding: 20 }}>
            <Text>Home</Text>
            <Button
                title="Submit"
                onPress={() => console.log('Pressed!')}
                variant="primary"
            />
            <Button
                title="Cancel"
                onPress={() => { }}
                variant="outline"
                style={{ marginTop: 10 }}
            />
            <Button
                title="Loading..."
                onPress={() => { }}
                loading
                variant="secondary"
                style={{ marginVertical: 20 }}
            />
            <Input
                label="Email"
                // placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={email.length < 5 ? 'Email too short' : ''}
            />

            <Input
                label="Password"
                // placeholder="Enter your password"
                secureTextEntry={secure}
                onIconPress={() => setSecure(!secure)}
                rightIcon={<Ionicons name={secure ? "eye-off" : "eye"} size={24} color="black" />}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})
