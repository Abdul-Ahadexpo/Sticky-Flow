import { VisitorData } from '../types';

function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  return 'Unknown';
}

function getDeviceInfo(userAgent: string): string {
  const matches = userAgent.match(/\(([^)]+)\)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  return 'Unknown Device';
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

export async function collectDeviceData(
  name: string,
  consentGeo: boolean
): Promise<Partial<VisitorData>> {
  const userAgent = navigator.userAgent;
  const visitorId = crypto.randomUUID();

  const data: Partial<VisitorData> = {
    id: visitorId,
    name,
    timestamp: Date.now(),
    userAgent,
    platform: navigator.platform,
    browserName: getBrowserName(userAgent),
    screen: {
      w: window.screen.width,
      h: window.screen.height,
    },
    viewport: {
      w: window.innerWidth,
      h: window.innerHeight,
    },
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: navigator.maxTouchPoints > 0,
    pageReferrer: document.referrer || 'Direct',
    isMobile: isMobileDevice(),
    deviceInfo: getDeviceInfo(userAgent),
    cookiesEnabled: navigator.cookieEnabled,
    consent: {
      deviceData: true,
      geo: consentGeo,
    },
    geoPermission: 'prompt',
  };

  const nav = navigator as any;

  if (nav.deviceMemory) {
    data.deviceMemory = nav.deviceMemory;
  }

  if (nav.hardwareConcurrency) {
    data.hardwareConcurrency = nav.hardwareConcurrency;
  }

  if (nav.connection) {
    data.connection = {
      type: nav.connection.effectiveType || 'unknown',
      downlink: nav.connection.downlink,
    };
  }

  try {
    if ('getBattery' in navigator) {
      const battery: any = await (navigator as any).getBattery();
      data.battery = {
        level: battery.level,
        charging: battery.charging,
      };
    }
  } catch (error) {
    console.log('Battery API not supported');
  }

  if (consentGeo && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0,
        });
      });

      data.geo = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      data.geoPermission = 'granted';
    } catch (error) {
      data.geo = null;
      data.geoPermission = 'denied';
    }
  } else if (!consentGeo) {
    data.geo = null;
    data.geoPermission = 'denied';
  } else {
    data.geo = null;
    data.geoPermission = 'unsupported';
  }

  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    data.ipAddress = ipData.ip;
  } catch (error) {
    console.log('Could not fetch IP address');
    data.ipAddress = 'unavailable';
  }

  return data;
}

export function generateVisitorId(): string {
  return crypto.randomUUID();
}

export function getStoredVisitorId(): string | null {
  return localStorage.getItem('visitorId');
}

export function setStoredVisitorId(id: string): void {
  localStorage.setItem('visitorId', id);
}

export function hasVisitorConsented(): boolean {
  return localStorage.getItem('visitorConsented') === 'true';
}

export function setVisitorConsented(): void {
  localStorage.setItem('visitorConsented', 'true');
}

export function clearVisitorConsent(): void {
  localStorage.removeItem('visitorConsented');
  localStorage.removeItem('visitorId');
  localStorage.removeItem('visitorName');
}
