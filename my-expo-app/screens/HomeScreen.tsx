import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStore';
import { ProfessionalInfo } from '../types';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfessionalInfo>({
    fullName: '',
    jobTitle: '',
    organization: '',
    workEmail: '',
    workPhone: '',
    linkedinUrl: '',
    websiteUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const existingData = await secureStorage.getProfessionalInfo();
      if (existingData) {
        setFormData(existingData);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfessionalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return false;
    }
    if (!formData.jobTitle.trim()) {
      Alert.alert('Validation Error', 'Job Title is required.');
      return false;
    }
    if (!formData.organization.trim()) {
      Alert.alert('Validation Error', 'Organization is required.');
      return false;
    }
    if (!formData.workEmail.trim()) {
      Alert.alert('Validation Error', 'Work Email is required.');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.workEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await secureStorage.saveProfessionalInfo(formData);
      Alert.alert('Success', 'Your information has been saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information. Please try again.');
    }
  };

  const handleViewQR = () => {
    if (!validateForm()) return;
    // Use type assertion to bypass TypeScript error temporarily
    router.push('/qr' as any);
  };

  const handleScan = () => {
    // Use type assertion to bypass TypeScript error temporarily
    router.push('/scan' as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Professional Information
            </Text>
            <Text className="text-gray-600">
              Fill in your details to share via QR code
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Full Name */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                placeholder="Enter your full name"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                autoCapitalize="words"
              />
            </View>

            {/* Job Title */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </Text>
              <TextInput
                value={formData.jobTitle}
                onChangeText={(value) => handleInputChange('jobTitle', value)}
                placeholder="e.g., Software Engineer"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                autoCapitalize="words"
              />
            </View>

            {/* Organization */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Organization/Company *
              </Text>
              <TextInput
                value={formData.organization}
                onChangeText={(value) => handleInputChange('organization', value)}
                placeholder="Enter your company name"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                autoCapitalize="words"
              />
            </View>

            {/* Work Email */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Work Email *
              </Text>
              <TextInput
                value={formData.workEmail}
                onChangeText={(value) => handleInputChange('workEmail', value)}
                placeholder="your.email@company.com"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Work Phone */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Work Phone (Optional)
              </Text>
              <TextInput
                value={formData.workPhone}
                onChangeText={(value) => handleInputChange('workPhone', value)}
                placeholder="+1 (555) 123-4567"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="phone-pad"
              />
            </View>

            {/* LinkedIn URL */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL (Optional)
              </Text>
              <TextInput
                value={formData.linkedinUrl}
                onChangeText={(value) => handleInputChange('linkedinUrl', value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Website/Portfolio */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Website/Portfolio (Optional)
              </Text>
              <TextInput
                value={formData.websiteUrl}
                onChangeText={(value) => handleInputChange('websiteUrl', value)}
                placeholder="https://yourwebsite.com"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-8 space-y-3">
            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-600 py-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Save Information
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewQR}
              className="bg-green-600 py-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold text-center">
                View My QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleScan}
              className="bg-purple-600 py-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Scan QR Code
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;