import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

interface OfflineScreenProps {
  onRetry?: () => void;
  message?: string;
  title?: string;
  showRefreshIcon?: boolean;
}

const { width, height } = Dimensions.get('window');

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ 
  onRetry, 
  message = "You're currently offline. Please check your internet connection and try again.",
  title = "No Internet Connection",
  showRefreshIcon = true
}) => {
  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior - check connection
      try {
        const state = await NetInfo.fetch();
        if (state.isConnected && state.isInternetReachable) {
          // Connection restored, you can trigger a refresh here
          console.log('Connection restored');
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="wifi-off" 
            size={80} 
            color="#666" 
          />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.message}>{message}</Text>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.8}
        >
          {showRefreshIcon && (
            <MaterialCommunityIcons 
              name="refresh" 
              size={20} 
              color="white" 
            />
          )}
          <Text style={styles.retryButtonText}>
            {showRefreshIcon ? 'Retry' : 'Check Connection'}
          </Text>
        </TouchableOpacity>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips:</Text>
          <Text style={styles.tipText}>• Check your WiFi or mobile data</Text>
          <Text style={styles.tipText}>• Try turning airplane mode on/off</Text>
          <Text style={styles.tipText}>• Move to an area with better signal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: Math.min(width * 0.9, 350),
    width: '100%',
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2447',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 30,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#e9ecef',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
});
