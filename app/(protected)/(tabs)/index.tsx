import { Text, View, ScrollView } from 'react-native';

export default function HomeTab() {
  return (
    <>
      <ScrollView className='bg-[f2f2f7]' contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-4 py-6">

          <Text className="text-blue-600 mt-4 font-okra">IativeWind is working!</Text>
        </View>
      </ScrollView>
    </>
  );
}
