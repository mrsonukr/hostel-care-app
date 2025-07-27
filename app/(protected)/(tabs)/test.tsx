import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import CustomHeader from '../../../components/CustomHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const hostels = [
    { number: 1, type: 'Boys' },
    { number: 2, type: 'Girls' },
    { number: 3, type: 'Girls' },
    { number: 4, type: 'Boys' },
    { number: 5, type: 'Girls' },
    { number: 6, type: 'Boys' },
    { number: 7, type: 'Girls' },
    { number: 8, type: 'Boys' },
    { number: 9, type: 'Girls' },
    { number: 10, type: 'Boys' },
    { number: 11, type: 'Girls' },
    { number: 12, type: 'Boys' },
    { number: 13, type: 'Girls' },
    { number: 14, type: 'Boys' },
    { number: 15, type: 'Girls' },
    { number: 16, type: 'Boys' },
    { number: 17, type: 'Girls' },
    { number: 18, type: 'Boys' },
    { number: 19, type: 'Girls' },
    { number: 20, type: 'Boys' },
];

export default function HostelListScreen() {
    const handlePress = () => {
        Haptics.selectionAsync(); // light vibration
    };

    return (
        <>
            <CustomHeader title="Hostel List" />
            <ScrollView className="bg-white" contentContainerStyle={{ padding: 16 }}>
                {hostels.map((hostel) => {
                    const isBoys = hostel.type === 'Boys';

                    return (
                        <TouchableOpacity
                            key={hostel.number}
                            onPress={handlePress}
                            activeOpacity={0.8}
                            className="flex-row items-center bg-neutral-50 rounded-xl px-4 py-3 mb-3"
                        >
                            {/* Avatar-like icon */}
                            <View
                                className={`w-10 h-10 rounded-full justify-center items-center mr-4 ${isBoys ? 'bg-blue-100' : 'bg-pink-100'
                                    }`}
                            >
                                <MaterialCommunityIcons
                                    name={isBoys ? 'face-man' : 'face-woman'}
                                    size={24}
                                    color={isBoys ? '#2563eb' : '#ec4899'}
                                />
                            </View>

                            {/* Hostel Info */}
                            <View className="flex-1 flex-row justify-between items-center">
                                <Text className="text-base font-medium text-black font-okra">
                                    Hostel {hostel.number}
                                </Text>
                                <Text className="text-sm text-gray-500 font-okra">
                                    {hostel.type}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </>
    );
}
