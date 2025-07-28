import { StyleSheet, Text, View, ScrollView } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

const notifications = [
  {
    id: 1,
    name: 'Amit Kumar',
    date: '20 Jul, Monday',
    status: 'Active',
    initial: 'A',
  },
  {
    id: 2,
    name: 'Sneha Verma',
    date: '21 Jul, Sunday',
    status: 'Resolved',
    initial: 'S',
  },
  {
    id: 3,
    name: 'Ravi Patel',
    date: '22 Jul, Saturday',
    status: 'Pending',
    initial: 'R',
  },
];

export default function NotificationsTab() {
  return (
    <>
      <CustomHeader title="Notifications" />
      <ScrollView style={styles.container}>
        {notifications.map((item, index) => (
          <View key={item.id} className="w-full px-4">
            <View className="flex-row items-center justify-between py-4">
              {/* Avatar + Info */}
              <View className="flex-row items-center gap-6">
                {/* Avatar */}
                <View className="bg-black w-12 h-12 items-center justify-center rounded-full">
                  <Text className="text-white text-2xl font-semibold">
                    {item.initial}
                  </Text>
                </View>

                <View>
                  <Text className="text-base font-medium text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.date}</Text>
                </View>
              </View>

              {/* Status */}
              <Text className="text-green-600 font-semibold text-sm">
                {item.status}
              </Text>
            </View>

            {/* Bottom border (excluding avatar) */}
            <View className="border-b border-gray-200 ml-[r]" />
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
