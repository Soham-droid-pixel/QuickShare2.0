import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  Alert,
  Share 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProfessionalInfo } from '../types';

const ResultScreen: React.FC = () => {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo | null>(null);

  useEffect(() => {
    if (data && typeof data === 'string') {
      try {
        const parsedData: ProfessionalInfo = JSON.parse(data);
        setProfessionalInfo(parsedData);
      } catch (error) {
        console.error('Error parsing professional info:', error);
        Alert.alert('Error', 'Failed to load professional information.');
      }
    }
  }, [data]);

  const handleEmailPress = async () => {
    if (!professionalInfo?.workEmail) return;
    
    try {
      const emailUrl = `mailto:${professionalInfo.workEmail}`;
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Error', 'Unable to open email client.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email.');
    }
  };

  const handlePhonePress = async () => {
    if (!professionalInfo?.workPhone) return;
    
    try {
      const phoneUrl = `tel:${professionalInfo.workPhone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to open phone dialer.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open phone dialer.');
    }
  };

  const handleLinkPress = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  const handleShare = async () => {
    if (!professionalInfo) return;
    
    try {
      const shareMessage = `Contact Information:\n\n${professionalInfo.fullName}\n${professionalInfo.jobTitle}\n${professionalInfo.organization}\n\nEmail: ${professionalInfo.workEmail}${professionalInfo.workPhone ? `\nPhone: ${professionalInfo.workPhone}` : ''}${professionalInfo.linkedinUrl ? `\nLinkedIn: ${professionalInfo.linkedinUrl}` : ''}${professionalInfo.websiteUrl ? `\nWebsite: ${professionalInfo.websiteUrl}` : ''}`;

      await Share.share({
        message: shareMessage,
        title: `${professionalInfo.fullName} - Contact Information`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!professionalInfo) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-xl text-gray-800 text-center mb-4">
          No Information Available
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 py-3 px-6 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Professional Contact
          </Text>
          <Text className="text-gray-600">
            Scanned information
          </Text>
        </View>

        {/* Contact Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          {/* Name and Title */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {professionalInfo.fullName}
            </Text>
            <Text className="text-lg text-gray-600 mb-1">
              {professionalInfo.jobTitle}
            </Text>
            <Text className="text-lg text-gray-600">
              {professionalInfo.organization}
            </Text>
          </View>

          {/* Contact Information */}
          <View className="space-y-4">
            {/* Email */}
            <TouchableOpacity
              onPress={handleEmailPress}
              className="flex-row items-center p-3 bg-blue-50 rounded-lg"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-600 mb-1">
                  Email
                </Text>
                <Text className="text-base text-blue-600 font-medium">
                  {professionalInfo.workEmail}
                </Text>
              </View>
              <Text className="text-blue-600 text-sm font-medium">
                Send Email
              </Text>
            </TouchableOpacity>

            {/* Phone */}
            {professionalInfo.workPhone && (
              <TouchableOpacity
                onPress={handlePhonePress}
                className="flex-row items-center p-3 bg-green-50 rounded-lg"
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </Text>
                  <Text className="text-base text-green-600 font-medium">
                    {professionalInfo.workPhone}
                  </Text>
                </View>
                <Text className="text-green-600 text-sm font-medium">
                  Call
                </Text>
              </TouchableOpacity>
            )}

            {/* LinkedIn */}
            {professionalInfo.linkedinUrl && (
              <TouchableOpacity
                onPress={() => handleLinkPress(professionalInfo.linkedinUrl!)}
                className="flex-row items-center p-3 bg-purple-50 rounded-lg"
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 mb-1">
                    LinkedIn
                  </Text>
                  <Text className="text-base text-purple-600 font-medium">
                    View Profile
                  </Text>
                </View>
                <Text className="text-purple-600 text-sm font-medium">
                  Open
                </Text>
              </TouchableOpacity>
            )}

            {/* Website */}
            {professionalInfo.websiteUrl && (
              <TouchableOpacity
                onPress={() => handleLinkPress(professionalInfo.websiteUrl!)}
                className="flex-row items-center p-3 bg-orange-50 rounded-lg"
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 mb-1">
                    Website
                  </Text>
                  <Text className="text-base text-orange-600 font-medium">
                    Visit Website
                  </Text>
                </View>
                <Text className="text-orange-600 text-sm font-medium">
                  Open
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <TouchableOpacity
            onPress={handleShare}
            className="bg-blue-600 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Share Contact
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('../scan')}
            className="bg-green-600 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Scan Another
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('../home')}
            className="bg-gray-200 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;
