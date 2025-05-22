import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStore';

const SetupScreen: React.FC = () => {
  const router = useRouter();

  const handleYesPasscode = async () => {
    try {
      // Save that user wants passcode protection
      await secureStorage.saveAppSettings({
        hasPasscode: true,
        isFirstLaunch: false,
      });
      router.push('../setPasscode');
    } catch (error) {
      console.error('Error setting up passcode:', error);
    }
  };

  const handleNoPasscode = async () => {
    try {
      // Save that user doesn't want passcode protection
      await secureStorage.saveAppSettings({
        hasPasscode: false,
        isFirstLaunch: false,
      });
      router.replace('../home');
    } catch (error) {
      console.error('Error setting up without passcode:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* App Logo/Title */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-center text-blue-600 mb-2">
            QuickShare
          </Text>
          <Text className="text-lg text-center text-gray-600">
            Professional Contact Sharing
          </Text>
        </View>

        {/* Main Question */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-center text-gray-800 mb-4">
            Welcome to QuickShare!
          </Text>
          <Text className="text-base text-center text-gray-600 leading-6">
            Do you want to protect your professional information with a 4-digit passcode?
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={handleYesPasscode}
            className="bg-blue-600 py-4 px-6 rounded-lg shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Yes, Set Passcode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNoPasscode}
            className="bg-gray-100 py-4 px-6 rounded-lg border border-gray-200"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              No, Skip Protection
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View className="mt-8">
          <Text className="text-sm text-center text-gray-500 leading-5">
            You can change this setting later in the app. Your information is stored locally on your device.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupScreen;