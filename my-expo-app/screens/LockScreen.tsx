import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStore';

const LockScreen: React.FC = () => {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (number: string) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const verifyPasscode = async () => {
    if (passcode.length === 4) {
      setIsLoading(true);
      try {
        const isValid = await secureStorage.verifyPasscode(passcode);
        if (isValid) {
          router.replace('/home' as any);
        } else {
          Alert.alert('Incorrect Passcode', 'Please try again.');
          setPasscode('');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify passcode. Please try again.');
        setPasscode('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (passcode.length === 4) {
      verifyPasscode();
    }
  }, [passcode]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* App Title */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-center text-blue-600 mb-2">
            QuickShare
          </Text>
          <Text className="text-base text-center text-gray-600">
            Enter your passcode to continue
          </Text>
        </View>

        {/* Passcode Dots */}
        <View className="flex-row space-x-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < passcode.length ? 'bg-blue-600' : 'bg-gray-300'
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
            >
              <Text className="text-2xl font-semibold text-gray-800">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center"
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text className="text-lg font-semibold text-gray-800">←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <Text className="text-gray-500 text-sm">Verifying...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LockScreen;