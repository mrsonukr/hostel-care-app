import React, { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Listing from './ui/Listing';

import { hostelCodeMap } from '../constants/hostelConstants';

interface Staff {
  name: string;
  mobile: string;
  role: string;
}

export default function EmergencyContactsBox() {
  const [wardenContact, setWardenContact] = useState<{ name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch warden contact from hostel details
  const fetchWardenContact = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const parsedData = JSON.parse(studentData);
        const hostelNo = parsedData.hostel_no;

        if (hostelNo) {
          // Extract hostel number from hostel code (e.g., "1B" -> "1", "2G" -> "2")
          const hostelNumber = Object.keys(hostelCodeMap).find(
            (key) => hostelCodeMap[Number(key)] === hostelNo
          );

          if (hostelNumber) {
            const response = await fetch(
              `https://hosteldetails.mssonutech.workers.dev/hostel/${hostelNumber}`
            );
            const data = await response.json();

            if (response.ok && data.staff) {
              // Find warden from staff list
              const warden = data.staff.find((staff: Staff) => 
                staff.role.toLowerCase() === 'warden'
              );
              
              if (warden) {
                setWardenContact({
                  name: warden.name,
                  phone: warden.mobile
                });
              } else {
                setWardenContact(null);
              }
            } else {
              setWardenContact(null);
            }
          } else {
            setWardenContact(null);
          }
        } else {
          setWardenContact(null);
        }
      }
    } catch (error) {
      console.error('Error fetching warden contact:', error);
      setWardenContact(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch warden contact when component mounts
  useEffect(() => {
    fetchWardenContact();
  }, []);

  // Refresh warden contact when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchWardenContact();
    }, [])
  );

  const emergencyContacts = [
    // Only add warden contact if it exists
    ...(wardenContact ? [{
      name: wardenContact.name,
      phone: wardenContact.phone,
      icon: 'user-tie',
      iconSet: 'FontAwesome5',
      bgColor: 'bg-red-500'
    }] : []),
    {
      name: 'Ambulance',
      phone: '102',
      icon: 'ambulance',
      iconSet: 'MaterialCommunityIcons',
      bgColor: 'bg-green-500'
    },
    {
      name: 'Police',
      phone: '112',
      icon: 'local-police',
      iconSet: 'MaterialIcons',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Fire Brigade',
      phone: '101',
      icon: 'fire-truck',
      iconSet: 'MaterialCommunityIcons',
      bgColor: 'bg-red-500'
    }
  ];

  // Don't render if no contacts available
  if (emergencyContacts.length === 0) {
    return null;
  }

  return (
    <View className="mx-4 mb-6">
      <Listing
        title="Emergency Contacts"
        data={emergencyContacts.map((contact) => ({
          icon: (
            <View className={`w-8 h-8 rounded-full items-center justify-center ${contact.bgColor}`}>
              {contact.iconSet === 'FontAwesome5' ? (
                <Text className="text-white text-sm font-bold">W</Text>
              ) : contact.iconSet === 'MaterialCommunityIcons' ? (
                <MaterialCommunityIcons name={contact.icon as any} size={20} color="white" />
              ) : contact.iconSet === 'MaterialIcons' ? (
                <MaterialIcons name={contact.icon as any} size={20} color="white" />
              ) : (
                <Feather name={contact.icon as any} size={20} color="white" />
              )}
            </View>
          ),
          label: contact.name,
          value: contact.phone,
          onPress: () => Linking.openURL(`tel:${contact.phone}`),
        }))}
      />
    </View>
  );
}
