import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const studentData = route?.params?.studentData;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          }),
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Feature', 'Edit Profile feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Feature', 'Change Password feature coming soon!');
  };

  const handleNotifications = () => {
    Alert.alert('Feature', 'Notifications settings coming soon!');
  };

  const handlePrivacy = () => {
    Alert.alert('Feature', 'Privacy & Security settings coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Feature', 'Help & Support coming soon!');
  };

  const handleHome = () => {
    navigation.navigate('Home', { studentData });
  };

  const handleDiagnostics = () => {
    Alert.alert('Feature', 'Diagnostics feature coming soon!');
  };

  const getDefaultProfileImage = (gender) => {
    return gender === 'female' 
      ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: studentData?.profile_pic_url || getDefaultProfileImage(studentData?.gender)
            }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{studentData?.full_name || 'Student Name'}</Text>
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileRoll}>Roll No: {studentData?.roll_no || 'N/A'}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="user" size={20} color="#007B5D" />
              <Text style={styles.infoLabel}>Full Name</Text>
            </View>
            <Text style={styles.infoValue}>{studentData?.full_name || 'N/A'}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="phone" size={20} color="#007B5D" />
              <Text style={styles.infoLabel}>Mobile Number</Text>
            </View>
            <Text style={styles.infoValue}>{studentData?.mobile_no || 'N/A'}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="mail" size={20} color="#007B5D" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <View style={styles.emailRow}>
              <Text style={styles.infoValue}>{studentData?.email || 'N/A'}</Text>
              {studentData?.email_verified !== 1 && (
                <View style={styles.notVerifiedIcon}>
                  <Text style={styles.exclamationText}>!</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name={studentData?.gender === 'female' ? 'user-x' : 'user-check'} size={20} color="#007B5D" />
              <Text style={styles.infoLabel}>Gender</Text>
            </View>
            <Text style={styles.infoValue}>{capitalizeFirst(studentData?.gender) || 'N/A'}</Text>
          </View>

          {studentData?.room_no && (
            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Feather name="home" size={20} color="#007B5D" />
                <Text style={styles.infoLabel}>Room Number</Text>
              </View>
              <Text style={styles.infoValue}>{studentData.room_no}</Text>
            </View>
          )}

          {studentData?.hostel_no && (
            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Feather name="building" size={20} color="#007B5D" />
                <Text style={styles.infoLabel}>Hostel Number</Text>
              </View>
              <Text style={styles.infoValue}>{studentData.hostel_no}</Text>
            </View>
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
            <View style={styles.settingLeft}>
              <Feather name="edit-3" size={20} color="#007B5D" />
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <View style={styles.settingLeft}>
              <Feather name="lock" size={20} color="#007B5D" />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleNotifications}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color="#007B5D" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
            <View style={styles.settingLeft}>
              <Feather name="shield" size={20} color="#007B5D" />
              <Text style={styles.settingLabel}>Privacy & Security</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
            <View style={styles.settingLeft}>
              <Feather name="help-circle" size={20} color="#007B5D" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Feather name="home" size={24} color="#8E8E93" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleDiagnostics}>
          <Feather name="activity" size={24} color="#8E8E93" />
          <Text style={styles.navText}>Diagnostics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Feather name="settings" size={24} color="#007B5D" />
          <Text style={[styles.navText, styles.activeNavText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F2F2F7',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRoll: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notVerifiedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  exclamationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomNavigation: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.OS === 'ios' ? 5 : 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#007B5D',
  },
});