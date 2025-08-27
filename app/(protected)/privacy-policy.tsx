import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';

import { useRouter } from 'expo-router';

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Privacy Policy" showBackButton onBackPress={() => router.back()} />
      <ScrollView className="flex-1 px-5 py-4">
        <Text className="text-lg font-bold text-black mb-4">Privacy Policy</Text>
        <Text className="text-sm text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-base font-semibold text-black mb-2">1. Information We Collect</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We collect information you provide directly to us, such as when you create an account, 
              update your profile, or contact us. This may include your name, email address, phone number, 
              hostel details, and profile picture.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">2. How We Use Your Information</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We use the information we collect to provide, maintain, and improve our services, 
              communicate with you, and ensure the security of our platform. Your hostel information 
              helps us provide relevant services and connect you with appropriate staff members.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">3. Information Sharing</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share information with 
              hostel authorities for administrative purposes.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">4. Data Security</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">5. Data Retention</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy. You may request deletion of your 
              account and associated data at any time.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">6. Your Rights</Text>
            <Text className="text-sm text-gray-700 leading-5">
              You have the right to access, update, or delete your personal information. You can 
              also opt out of certain communications and request information about how we process 
              your data.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">7. Contact Us</Text>
            <Text className="text-sm text-gray-700 leading-5">
              If you have any questions about this Privacy Policy or our data practices, please 
              contact us at privacy@hostelcare.com or through the app's support section.
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-black mb-2">8. Changes to This Policy</Text>
            <Text className="text-sm text-gray-700 leading-5">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </Text>
          </View>
        </View>

        <View className="mt-8 mb-4">
          <Text className="text-xs text-gray-500 text-center">
            By using HostelCare, you agree to the collection and use of information in accordance 
            with this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy; 