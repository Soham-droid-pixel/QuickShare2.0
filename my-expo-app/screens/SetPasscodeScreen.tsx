import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStore';

const SetPasscodeScreen: React.FC = () => {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleNumberPress = (number: string) => {
    if (isConfirming) {
      if (confirmPasscode.length < 4) {
        setConfirmPasscode(prev => prev + number);
      }
    } else {
      if (passcode.length < 4) {
        setPasscode(prev => prev + number);
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPasscode(prev => prev.slice(0, -1));
    } else {
      setPasscode(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = async () => {
    if (passcode.length === 4) {
      if (!isConfirming) {
        setIsConfirming(true);
      } else {
        // Confirm passcode
        if (passcode === confirmPasscode) {
          try {
            await secureStorage.savePasscode(passcode);
            router.replace('../home');
          } catch (error) {
            Alert.alert('Error', 'Failed to save passcode. Please try again.');
          }
        } else {
          Alert.alert('Passcode Mismatch', 'Passcodes do not match. Please try again.');
          setPasscode('');
          setConfirmPasscode('');
          setIsConfirming(false);
        }
      }
    }
  };

  const currentPasscode = isConfirming ? confirmPasscode : passcode;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
            {isConfirming ? 'Confirm Passcode' : 'Set Passcode'}
          </Text>
          <Text className="text-base text-center text-gray-600">
            {isConfirming 
              ? 'Enter your passcode again to confirm' 
              : 'Create a 4-digit passcode to protect your information'
            }
          </Text>
        </View>

        {/* Passcode Dots */}
        <View className="flex-row space-x-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < currentPasscode.length ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Number Pad */}
        <View className="mb-8">
          {/* First Row */}
          <View className="flex-row space-x-4 mb-4">
            {['1', '2', '3'].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumberPress(number)}
                className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
                activeOpacity={0.7}
              >
                <Text className="text-2xl font-semibold text-gray-800">
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row */}
          <View className="flex-row space-x-4 mb-4">
            {['4', '5', '6'].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumberPress(number)}
                className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
                activeOpacity={0.7}
              >
                <Text className="text-2xl font-semibold text-gray-800">
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Third Row */}
          <View className="flex-row space-x-4 mb-4">
            {['7', '8', '9'].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumberPress(number)}
                className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
                activeOpacity={0.7}
              >
                <Text className="text-2xl font-semibold text-gray-800">
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fourth Row */}
          <View className="flex-row space-x-4">
            <View className="w-16 h-16" /> {/* Empty space */}
            <TouchableOpacity
              onPress={() => handleNumberPress('0')}
              className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
              activeOpacity={0.7}
            >
              <Text className="text-2xl font-semibold text-gray-800">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
              activeOpacity={0.7}
            >
              <Text className="text-lg font-semibold text-gray-800">←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        {currentPasscode.length === 4 && (
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-blue-600 py-3 px-8 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              {isConfirming ? 'Confirm' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SetPasscodeScreen;