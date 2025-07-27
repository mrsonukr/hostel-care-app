import { StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import "../../../global.css"; // Ensure global styles are imported


export default function NotificationsTab() {
  return (
    <>
      <CustomHeader title="Notifications" />
      <View style={styles.container}>
        <Text className='text-red-500 font-bold'>Notifications Tab</Text>
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