import {
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import CustomHeader from '../../components/CustomHeader';
import SubmitButton from '../../components/ui/SubmitButton';

export default function EnterRoomScreen() {
    const [digits, setDigits] = useState(['0', '0', '1']);
    const [loading, setLoading] = useState(false);

    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        let newDigits = [...digits];
        newDigits[index] = value;

        // Auto-fill left-side with 0 if user starts from middle or end
        if (index === 2) {
            if (newDigits[0] === '' && newDigits[1] === '' && value) {
                newDigits = ['0', '0', value];
            } else if (newDigits[0] === '' && value) {
                newDigits[0] = '0';
            } else if (newDigits[1] === '' && value) {
                newDigits[1] = '0';
            }
        }

        if (index === 1 && newDigits[0] === '' && value) {
            newDigits[0] = '0';
        }

        setDigits(newDigits);

        if (value && index < 2) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace') {
            if (digits[index] === '' && index > 0) {
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                setDigits(newDigits);
                inputRefs[index - 1].current?.focus();
            }
        }
    };

    const handleSubmit = async () => {
        const roomNumber = digits.join('');

        if (!/^\d{3}$/.test(roomNumber)) {
            Alert.alert('Invalid Room Number');
            return;
        }

        setLoading(true);
        await Haptics.selectionAsync();

        setTimeout(() => {
            Alert.alert('Hostel Updated', `Room Number: ${roomNumber}`);
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <CustomHeader title="Enter Room Number" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1 bg-white px-6"
                >
                    <View className="pt-10">
                        {/* Room Number Input Boxes */}
                        <View className="items-center mb-10">
                            <View className="flex-row justify-center gap-4">
                                {digits.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={inputRefs[index]}
                                        value={digit}
                                        onChangeText={(value) => handleChange(index, value)}
                                        onKeyPress={({ nativeEvent }) =>
                                            handleKeyPress(index, nativeEvent.key)
                                        }
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        className="w-16 h-16 border border-gray-300 rounded-xl text-center text-2xl font-bold text-black"
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Submit Button */}
                        <View className="items-center">
                            <SubmitButton
                                title="Submit"
                                icon="arrow-right"
                                onPress={handleSubmit}
                                loading={loading}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </>
    );

}
