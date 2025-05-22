export interface ProfessionalInfo {
  fullName: string;
  jobTitle: string;
  organization: string;
  workEmail: string;
  workPhone?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface AppSettings {
  hasPasscode: boolean;
  isFirstLaunch: boolean;
}

export type RootStackParamList = {
  setup: undefined;
  setPasscode: undefined;
  lock: undefined;
  home: undefined;
  qr: undefined;
  scan: undefined;
  result: { data: ProfessionalInfo };
};