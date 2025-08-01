import React, { useCallback, useEffect, useState } from 'react';
import {
    TextInput,
    Text,
    View,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp,
    TextStyle,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { debounce } from 'lodash';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    loading?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onIconPress?: () => void;
    debounceDelay?: number;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    loading,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    leftIcon,
    rightIcon,
    onIconPress,
    debounceDelay = 300,
    onChangeText,
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const labelAnimated = useSharedValue(value ? 1 : 0);
    const borderWidthAnimation = useSharedValue(0);

    const animatedLabelStyle = useAnimatedStyle(() => ({
        top: withTiming(interpolate(labelAnimated.value, [0, 1], [14, -10])),
        fontSize: withTiming(interpolate(labelAnimated.value, [0, 1], [16, 12])),
        borderWidth: withTiming(interpolate(borderWidthAnimation.value, [0, 1], [1, 0])),
        borderRadius: withTiming(interpolate(borderWidthAnimation.value, [0, 1], [8, 0])),
    }));

    const handleFocus = () => {
        setIsFocused(true);
        labelAnimated.value = 1;
        borderWidthAnimation.value = withTiming(0, { duration: 200 });
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!internalValue) {
            labelAnimated.value = 0;
            borderWidthAnimation.value = withTiming(1, { duration: 200 });
        }
    };

    const debouncedChangeText = useCallback(
        debounce((text: string) => onChangeText?.(text), debounceDelay),
        [onChangeText, debounceDelay]
    );

    const handleChange = (text: string) => {
        setInternalValue(text);
        debouncedChangeText(text);
    };

    useEffect(() => {
        setInternalValue(value || '');
        if (value) labelAnimated.value = 1;
    }, [value]);

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

                <TextInput
                    style={[styles.input, inputStyle]}
                    value={internalValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={handleChange}
                    placeholderTextColor="#888"
                    {...props}
                />

                {loading ? (
                    <ActivityIndicator size="small" style={styles.icon} />
                ) : rightIcon ? (
                    <Pressable onPress={onIconPress} style={styles.icon}>
                        {rightIcon}
                    </Pressable>
                ) : null}

                {label && (
                    <Animated.View style={[styles.labelWrapper, animatedLabelStyle]}>
                        <Text style={[styles.label, labelStyle]}>{label}</Text>
                    </Animated.View>
                )}
            </View>

            {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        padding: 0,
        margin: 0,
        paddingHorizontal: 12,
        paddingTop: 18,
        paddingBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    labelWrapper: {
        position: 'absolute',
        left: 12,
        paddingHorizontal: 4,
        backgroundColor: '#fff',
        borderColor: '#666',
    },
    label: {
        color: '#666',
    },
    inputError: {
        borderColor: '#e53935',
    },
    errorText: {
        marginTop: 4,
        color: '#e53935',
        fontSize: 12,
    },
});

