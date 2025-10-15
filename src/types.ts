export interface Note {
  id: string;
  mainText: string;
  hiddenDescription?: string;
  date: string;
  markWithX: boolean;
  createdAt: number;
}

export interface HelpText {
  content: string;
}

export interface VisitorData {
  id: string;
  name: string;
  timestamp: number;
  userAgent: string;
  platform: string;
  browserName: string;
  screen: { w: number; h: number };
  viewport: { w: number; h: number };
  language: string;
  timezone: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  touchSupport: boolean;
  connection?: { type: string; downlink?: number };
  battery?: { level: number; charging: boolean };
  geo?: { lat: number; lng: number } | null;
  geoPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  ipAddress?: string;
  pageReferrer: string;
  isMobile: boolean;
  deviceInfo: string;
  cookiesEnabled: boolean;
  consent: {
    deviceData: boolean;
    geo: boolean;
  };
}
