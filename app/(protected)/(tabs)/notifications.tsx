import { StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

export default function NotificationsTab() {
  return (
    <>
      <CustomHeader title="Notifications" />
      <View style={styles.container}>
        <Text>Notifications Tab</Text>
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