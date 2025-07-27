import { StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

export default function NotificationsTab() {
  return (
    <>
      <CustomHeader title="Notifications" />
      <View style={styles.container}>
        <Text className="text-red-500 text-xl font-okra">Notifications Tab</Text>
        <Text className="text-blue-600 mt-4">NativeWind is working!</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});