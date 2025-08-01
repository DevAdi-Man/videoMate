import React from 'react';
import { StyleProp, ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'


type ButtonVarient = 'primary' | 'secondary' | 'outline'

interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: ButtonVarient;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
    title, onPress,
    variant,
    disabled,
    loading,
    style,
    textStyle
}) => {
    const getButtonStyle = (): StyleProp<ViewStyle> => {
        const baseStyle = [styles.base, style];
        if (disabled) return [...baseStyle, styles.disabled];
        switch (variant) {
            case 'secondary':
                return [...baseStyle, styles.secondary];
            case 'outline':
                return [...baseStyle, styles.outline]
            default:
                return [...baseStyle, styles.primary];
        }
    };

    const getTextStyle = (): StyleProp<TextStyle> => {
        const baseTextStyle = [styles.text, textStyle]
        if (variant === 'outline') return [...baseTextStyle, styles.outlineText];
        return baseTextStyle;
    };
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={getButtonStyle()}>
            {
                loading ? (
                    <ActivityIndicator color='#fff' />
                ) : (
                    <Text style={getTextStyle()}>{title}</Text>
                )
            }
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    base: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    primary: {
        backgroundColor: '#007bff'
    },
    secondary: {
        backgroundColor: '#6c757d'
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    disabled: {
        backgroundColor: '#c0c0c0'
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    },
    outlineText: {
        color: '#007bff'
    }
})
