import React from 'react';
import { View, Text,  Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Listing from './ui/Listing';

export default function EmergencyContactsBox() {
  const emergencyContacts = [
    {
      name: 'Hostel Warden',
      phone: '+91 98765 43210',
      icon: 'user-tie',
      iconSet: 'FontAwesome5',
      bgColor: 'bg-red-500'
    },
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
