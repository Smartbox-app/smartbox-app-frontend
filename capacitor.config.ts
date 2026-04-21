import { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig = {
  appId: process.env.NODE_APP_ID,
  appName: process.env.NODE_APP_NAME,
  ios: {
    contentInset: 'never',
    
  },
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['*'],
  },
  android: {
    useLegacyBridge: true,
  },
  webDir: 'dist',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: false,
      launchAutoHide: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  cordova: {},
};

export default config;
