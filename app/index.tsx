import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, View, ActivityIndicator } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
export default function WelcomeScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated !== null) {
            if (isAuthenticated) {
                // User is logged in, redirect to protected area
                // Use a small delay to ensure navigation is ready
                setTimeout(() => {
                    router.replace('/(protected)/(tabs)');
                }, 100);
            } else {
                // User is not logged in, stay on welcome screen
                setIsLoading(false);
            }
        }
    }, [isAuthenticated, router]);



    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="#0D0D0D" />
            </View>
        );
    }

    return (
        <PaperProvider>
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40 }}>
                {/* Top Image */}
                <View style={{ flex: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/vectors/students.png')}
                        style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                    />
                </View>

                {/* Welcome Text */}
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#0D0D0D', fontFamily: 'Okra-Bold' }}>
                        Welcome to HostelCare
                    </Text>
                    <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, color: '#555', fontFamily: 'Okra-Regular' }}>
                        Start your journey with us. Explore, engage, and enjoy!
                    </Text>
                </View>

                {/* Bottom Buttons */}
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/(auth)/login')}
                        style={{
                            borderRadius: 30,
                            backgroundColor: '#0D0D0D',
                            elevation: 0,
                        }}
                        contentStyle={{
                            height: 50,
                            justifyContent: 'center',
                        }}
                        labelStyle={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white',
                        }}
                    >
                        Get Started
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
}