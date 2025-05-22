import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ProfessionalInfo } from '../types';

const { width } = Dimensions.get('window');

const ScanScreen: React.FC = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Try to parse the QR code data as JSON
      const parsedData: ProfessionalInfo = JSON.parse(data);
      
      // Validate that it contains the expected professional info structure
      if (parsedData.fullName && parsedData.jobTitle && parsedData.organization && parsedData.workEmail) {
        // Navigate to result screen with the parsed data
        router.push({
          pathname: '../result',
          params: { 
            data: JSON.stringify(parsedData)
          }
        });
      } else {
        throw new Error('Invalid professional info format');
      }
    } catch (error) {
      console.error('Error parsing QR code:', error);
      Alert.alert(
        'Invalid QR Code',
        'This QR code does not contain valid professional information.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel',
          }
        ]
      );
    }
  };

  const handleManualReset = () => {
    setScanned(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-xl text-gray-800 text-center mb-4">
          Requesting Camera Permission
        </Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-xl text-gray-800 text-center mb-4">
          Camera Access Denied
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please enable camera permissions in your device settings to scan QR codes.
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
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Header */}
        <View className="absolute top-12 left-0 right-0 z-10 px-6">
          <Text className="text-white text-xl font-bold text-center mb-2">
            Scan QR Code
          </Text>
          <Text className="text-white text-sm text-center opacity-80">
            Point your camera at a professional QR code
          </Text>
        </View>

        {/* Camera View */}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />

        {/* Scanning Frame */}
        <View className="absolute inset-0 justify-center items-center">
          <View 
            className="border-2 border-white rounded-2xl bg-transparent"
            style={{
              width: width * 0.7,
              height: width * 0.7,
            }}
          >
            {/* Corner indicators */}
            <View className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg" />
            <View className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg" />
            <View className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg" />
            <View className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg" />
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-12 left-0 right-0 px-6">
          {scanned && (
            <TouchableOpacity
              onPress={handleManualReset}
              className="bg-green-600 py-4 rounded-lg mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Scan Again
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-600 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="absolute bottom-32 left-0 right-0 px-6">
          <Text className="text-white text-sm text-center opacity-80">
            Align the QR code within the frame above
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanScreen;