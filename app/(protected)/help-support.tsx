import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import StatusBarArea from '../../components/StatusBarArea';
import { useRouter } from 'expo-router';

const HelpSupport = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I update my hostel information?",
      answer: "Go to Settings → Hostel Details → Edit Hostel. You can select your hostel number and room number, then save the changes."
    },
    {
      question: "How do I change my profile picture?",
      answer: "Go to Settings → Profile Information → tap on your profile picture → select a new image from your gallery."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "Contact your hostel administration or use the 'Forgot Password' option on the login screen if available."
    },
    {
      question: "How do I contact hostel staff?",
      answer: "Go to Hostel Details → Contacts section. You'll find phone numbers for warden and caretaker, and a WhatsApp group link."
    },
    {
      question: "Can I change my room?",
      answer: "Room change requests can be made through the hostel administration. Use the 'Request Room Change' option in Hostel Details → Quick Actions."
    },
    {
      question: "How do I report maintenance issues?",
      answer: "Go to Hostel Details → Quick Actions → Report Maintenance Issue. This feature will be available soon."
    }
  ];

  const contactMethods = [
    {
      icon: <Feather name="phone" size={24} color="#0D0D0D" />,
      title: "Call Support",
      subtitle: "Speak with our team",
      action: () => Linking.openURL('tel:+918210220189'),
      color: "bg-blue-50"
    },
    {
      icon: <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />,
      title: "WhatsApp Support",
      subtitle: "Get instant help",
      action: () => Linking.openURL('https://wa.me/918210220189'),
      color: "bg-green-50"
    },
    {
      icon: <Feather name="mail" size={24} color="#0D0D0D" />,
      title: "Email Support",
      subtitle: "Send us an email",
      action: () => Linking.openURL('mailto:support@hostelcare.com'),
      color: "bg-purple-50"
    }
  ];

  const quickActions = [
    {
      icon: <Feather name="book" size={20} color="#0D0D0D" />,
      title: "User Guide",
      subtitle: "Learn how to use the app"
    },
    {
      icon: <Feather name="download" size={20} color="#0D0D0D" />,
      title: "Download Manual",
      subtitle: "Get the complete guide"
    },
    {
      icon: <Feather name="video" size={20} color="#0D0D0D" />,
      title: "Video Tutorials",
      subtitle: "Watch helpful videos"
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBarArea />
      <CustomHeader title="Help & Support" showBackButton onBackPress={() => router.back()} />
      <ScrollView className="flex-1 px-4 py-4">
        {/* Header Section */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Feather name="help-circle" size={28} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-black">Need Help?</Text>
              <Text className="text-sm text-gray-500">We're here to assist you</Text>
            </View>
          </View>
          <Text className="text-sm text-gray-600 leading-5">
            Find answers to common questions, contact our support team, or explore helpful resources to make the most of your HostelCare experience.
          </Text>
        </View>

        {/* Contact Methods */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Contact Support</Text>
          <View className="space-y-3">
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={method.action}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 ${method.color} rounded-full items-center justify-center mr-4`}>
                    {method.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black">{method.title}</Text>
                    <Text className="text-sm text-gray-600">{method.subtitle}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Quick Actions</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-3"
                onPress={() => {/* TODO: Implement actions */}}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  {action.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-black">{action.title}</Text>
                  <Text className="text-sm text-gray-600">{action.subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Frequently Asked Questions</Text>
          <View className="space-y-3">
            {faqs.map((faq, index) => (
              <View key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleFaq(index)}
                  className="p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-black flex-1 mr-3">
                      {faq.question}
                    </Text>
                    <Feather 
                      name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </View>
                </TouchableOpacity>
                {expandedFaq === index && (
                  <View className="px-4 pb-4">
                    <View className="h-px bg-gray-200 mb-3" />
                    <Text className="text-sm text-gray-700 leading-5">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
              <Feather name="clock" size={20} color="#10B981" />
            </View>
            <Text className="text-lg font-semibold text-black">Support Hours</Text>
          </View>
          <Text className="text-sm text-gray-700 leading-5 mb-3">
            Our support team is available Monday to Friday, 9:00 AM to 6:00 PM IST. For urgent matters outside these hours, please use the WhatsApp support option.
          </Text>
          <View className="flex-row items-center bg-blue-50 rounded-lg p-3">
            <Feather name="info" size={16} color="#3B82F6" />
            <Text className="text-sm text-blue-700 ml-2 font-medium">
              We typically respond within 2-4 hours
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupport; 