import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Alert, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { secureStorage } from '../utils/secureStore';
import { ProfessionalInfo } from '../types';

const QRScreen: React.FC = () => {
  const router = useRouter();
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo | null>(null);
  const [qrValue, setQRValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfessionalInfo();
  }, []);

  const loadProfessionalInfo = async () => {
    try {
      const info = await secureStorage.getProfessionalInfo();
      if (info) {
        setProfessionalInfo(info);
        // Convert to JSON string for QR code
        const qrData = JSON.stringify(info);
        setQRValue(qrData);
      } else {
        Alert.alert(
          'No Information Found', 
          'Please fill in your professional information first.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading professional info:', error);
      Alert.alert('Error', 'Failed to load your information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!professionalInfo) return;
    
    try {
      const shareMessage = `${professionalInfo.fullName} - ${professionalInfo.jobTitle} at ${professionalInfo.organization}\n\nEmail: ${professionalInfo.workEmail}${professionalInfo.workPhone ? `\nPhone: ${professionalInfo.workPhone}` : ''}${professionalInfo.linkedinUrl ? `\nLinkedIn: ${professionalInfo.linkedinUrl}` : ''}${professionalInfo.websiteUrl ? `\nWebsite: ${professionalInfo.websiteUrl}` : ''}`;

      await Share.share({
        message: shareMessage,
        title: 'Professional Contact Information',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!professionalInfo) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-xl text-gray-800 text-center mb-4">
          No Information Available
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please go back and fill in your professional information first.
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
            Your QR Code
          </Text>
          <Text className="text-base text-center text-gray-600">
            Share this code for others to scan
          </Text>
        </View>

        {/* QR Code */}
        <View className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <QRCode
            value={qrValue}
            size={250}
            color="black"
            backgroundColor="white"
          />
        </View>

        {/* Professional Info Preview */}
        <View className="bg-gray-50 p-4 rounded-lg mb-8 w-full">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {professionalInfo.fullName}
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            {professionalInfo.jobTitle}
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            {professionalInfo.organization}
          </Text>
          <Text className="text-base text-blue-600">
            {professionalInfo.workEmail}
          </Text>
          {professionalInfo.workPhone && (
            <Text className="text-base text-gray-600 mt-1">
              {professionalInfo.workPhone}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-3">
          <TouchableOpacity
            onPress={handleShare}
            className="bg-green-600 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Share Information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-200 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="mt-6">
          <Text className="text-sm text-center text-gray-500 leading-5">
            Ask others to scan this QR code with their QuickShare app or any QR scanner to view your professional information.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRScreen;