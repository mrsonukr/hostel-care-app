import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          }),
      },
    ]);
  };

  const handleRaiseComplaint = () => {
    Alert.alert("Feature", "Raise Complaint feature coming soon!");
  };

  const handleViewComplaintStatus = () => {
    Alert.alert("Feature", "View Complaint Status feature coming soon!");
  };

  const handleDiagnostics = () => {
    Alert.alert("Feature", "Diagnostics feature coming soon!");
  };

  const handleSettings = () => {
    Alert.alert("Feature", "Settings feature coming soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="home" size={24} color="#007B5D" />
          <Text style={styles.headerTitle}>HostelCare</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={22} color="#007B5D" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome to your HostelCare dashboard. Manage your complaints and
            issues easily.
          </Text>
        </View>

        <View style={styles.actionsList}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleRaiseComplaint}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIcon}>
                <Feather name="plus-circle" size={20} color="#007B5D" />
              </View>
              <Text style={styles.actionTitle}>Raise Complaint</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleViewComplaintStatus}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIcon}>
                <Feather name="eye" size={20} color="#007B5D" />
              </View>
              <Text style={styles.actionTitle}>View Complaint Status</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#007B5D" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleDiagnostics}>
          <Feather name="activity" size={24} color="#8E8E93" />
          <Text style={styles.navText}>Diagnostics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleSettings}>
          <Feather name="settings" size={24} color="#8E8E93" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Header and footer white
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F2F2F7", // light gray
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
  },
  actionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  bottomNavigation: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5EA",
    paddingBottom: Platform.OS === "ios" ? 5 : 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    fontWeight: "500",
  },
  activeNavText: {
    color: "#007B5D",
  },
});
