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

        <View className="space-y-6">
          {/* Introduction */}
          <View>
            <View className="flex-row justify-between items-center my-3">
              <Text className="text-base font-semibold text-black font-okra">Introduction</Text>
              <Text className="text-sm text-gray-600">Last updated: 01/08/2025</Text>
            </View>
            <Text className="text-sm text-gray-700 leading-6">
              HostelCare is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our hostel management mobile application and related services.
            </Text>
          </View>

          {/* Information Collection */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">1. Information We Collect</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">1.1 Personal Information:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Student identification details (roll number, full name, gender){"\n"}
              • Contact information (mobile number, email address){"\n"}
              • Academic information (hostel number, room number){"\n"}
              • Profile pictures and user-generated content{"\n"}
              • Authentication credentials and login information
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">1.2 Hostel-Specific Data:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Hostel allocation and room assignment details{"\n"}
              • Entry/exit timing records and compliance data{"\n"}
              • Complaint and maintenance request information{"\n"}
              • Mess timing preferences and dietary requirements{"\n"}
              • Emergency contact information
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">1.3 Technical Information:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Device information (device type, operating system, unique device identifiers){"\n"}
              • Usage analytics and app performance data{"\n"}
              • Network information and connection details{"\n"}
              • Crash reports and error logs
            </Text>
          </View>

          {/* How We Use Information */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">2. How We Use Your Information</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">2.1 Core Services:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Provide hostel management and accommodation services{"\n"}
              • Facilitate communication between students and hostel authorities{"\n"}
              • Manage complaints, maintenance requests, and emergency situations{"\n"}
              • Track hostel entry/exit compliance and security{"\n"}
              • Coordinate mess services and dietary requirements
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">2.2 Administrative Purposes:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Verify student identity and hostel eligibility{"\n"}
              • Generate reports for hostel administration{"\n"}
              • Ensure compliance with hostel rules and regulations{"\n"}
              • Coordinate with emergency services when necessary
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">2.3 Service Improvement:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Analyze app usage patterns and user behavior{"\n"}
              • Improve app functionality and user experience{"\n"}
              • Develop new features based on user feedback{"\n"}
              • Ensure app security and prevent fraud
            </Text>
          </View>

          {/* Information Sharing */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">3. Information Sharing and Disclosure</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">3.1 With Hostel Authorities:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Share student information with hostel wardens and staff for administrative purposes{"\n"}
              • Provide complaint and maintenance request details to relevant authorities{"\n"}
              • Share emergency contact information during critical situations{"\n"}
              • Report compliance violations to hostel management
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">3.2 Legal Requirements:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Comply with applicable laws, regulations, and legal processes{"\n"}
              • Respond to lawful requests from government authorities{"\n"}
              • Protect our rights, property, and safety, as well as those of our users{"\n"}
              • Investigate and prevent potential security threats or fraud
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">3.3 Third-Party Services:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Use cloud storage services for data backup and synchronization{"\n"}
              • Employ analytics services to improve app performance{"\n"}
              • Utilize push notification services for important updates{"\n"}
              • All third-party services are bound by strict data protection agreements
            </Text>
          </View>

          {/* Data Security */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">4. Data Security and Protection</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">4.1 Security Measures:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • End-to-end encryption for sensitive data transmission{"\n"}
              • Secure authentication and authorization protocols{"\n"}
              • Regular security audits and vulnerability assessments{"\n"}
              • Multi-factor authentication for administrative access
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">4.2 Data Protection:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Secure data centers with physical and digital security{"\n"}
              • Regular data backups and disaster recovery procedures{"\n"}
              • Access controls and role-based permissions{"\n"}
              • Employee training on data protection and privacy
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">4.3 Incident Response:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • 24/7 monitoring for security threats and breaches{"\n"}
              • Immediate response protocols for data security incidents{"\n"}
              • User notification within 72 hours of any breach{"\n"}
              • Cooperation with relevant authorities during investigations
            </Text>
          </View>

          {/* Data Retention */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">5. Data Retention and Deletion</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">5.1 Retention Periods:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Active student data: Retained throughout hostel stay{"\n"}
              • Academic records: Retained for 7 years after graduation{"\n"}
              • Complaint records: Retained for 3 years for reference{"\n"}
              • Emergency contact data: Retained until account deletion
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">5.2 Data Deletion:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Immediate deletion upon account closure request{"\n"}
              • Gradual deletion of inactive accounts after 2 years{"\n"}
              • Secure deletion methods to prevent data recovery{"\n"}
              • Confirmation of complete data removal
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">5.3 Backup Retention:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Encrypted backups retained for 30 days{"\n"}
              • Disaster recovery backups retained for 90 days{"\n"}
              • Automatic cleanup of expired backup data{"\n"}
              • Secure destruction of physical backup media
            </Text>
          </View>

          {/* User Rights */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">6. Your Rights and Choices</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">6.1 Access and Control:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • View and download your personal data in portable format{"\n"}
              • Update or correct inaccurate information{"\n"}
              • Request deletion of specific data categories{"\n"}
              • Opt out of non-essential communications
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">6.2 Privacy Settings:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Control profile visibility and information sharing{"\n"}
              • Manage notification preferences and frequency{"\n"}
              • Set emergency contact sharing permissions{"\n"}
              • Configure data synchronization preferences
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">6.3 Account Management:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Deactivate or delete your account at any time{"\n"}
              • Export your data before account deletion{"\n"}
              • Request data processing information{"\n"}
              • Lodge privacy-related complaints or concerns
            </Text>
          </View>

          {/* Children's Privacy */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">7. Children's Privacy</Text>
            <Text className="text-sm text-gray-700 leading-6">
              HostelCare is designed for university and college students who are typically 18 years or older. We do not knowingly collect personal information from individuals under 18 years of age. If we become aware that we have collected such information, we will take immediate steps to delete it and notify the relevant authorities.
            </Text>
          </View>

          {/* International Transfers */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">8. International Data Transfers</Text>
            <Text className="text-sm text-gray-700 leading-6">
              Your data is primarily processed and stored within India. However, some third-party services may be located in other countries. We ensure that all international data transfers comply with applicable data protection laws and implement appropriate safeguards, including standard contractual clauses and adequacy decisions.
            </Text>
          </View>

          {/* Cookies and Tracking */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">9. Cookies and Tracking Technologies</Text>
            <Text className="text-sm text-gray-700 leading-6">
              Our app uses essential cookies and similar technologies to provide core functionality, maintain user sessions, and improve app performance. We do not use tracking cookies for advertising purposes. You can control cookie preferences through your device settings, though disabling essential cookies may affect app functionality.
            </Text>
          </View>

          {/* Contact Information */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">10. Contact Information</Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">For Privacy Inquiries:</Text>
            <Text className="text-sm text-gray-700 leading-6 mb-3">
              • Email: hostelcare@gmail.com{"\n"}
              • Phone: +91-7061543815{"\n"}
              • Address: MMEC, Mullana Ambala 133207{"\n"}
              • Response Time: Within 48 hours
            </Text>

            <Text className="text-sm font-medium text-gray-800 mb-2 font-okra">For Data Protection Officer:</Text>
            <Text className="text-sm text-gray-700 leading-6">
              • Email: hostelcare@gmail.com{"\n"}
              • Phone: +91-7061543815{"\n"}
              • Specialized in: Data protection and privacy compliance
            </Text>
          </View>

          {/* Policy Updates */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">11. Changes to This Privacy Policy</Text>
            <Text className="text-sm text-gray-700 leading-6">
              We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes through in-app notifications, email, or other appropriate means. Your continued use of HostelCare after such changes constitutes acceptance of the updated policy.
            </Text>
          </View>

          {/* Governing Law */}
          <View>
            <Text className="text-base font-semibold text-black mb-3 font-okra">12. Governing Law and Dispute Resolution</Text>
            <Text className="text-sm text-gray-700 leading-6">
              This Privacy Policy is governed by the laws of India. Any disputes arising from this policy or our data practices will be resolved through amicable discussions. If resolution cannot be reached, disputes will be subject to the exclusive jurisdiction of courts in Ambala, India.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 mb-6 p-4 bg-gray-50 rounded-lg">
          <Text className="text-sm text-gray-600 text-center leading-6 font-okra">
            By using HostelCare, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-3 font-okra">
            This Privacy Policy is effective as of 01/08/2025 and supersedes all previous versions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy; 