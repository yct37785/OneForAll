import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    name: "__APP_NAME__",
    slug: "__APP_SLUG__",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "__APP_PACKAGE__",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
	    [
        "expo-build-properties",
        {
          android: {
            extraProguardRules: "-keep class com.google.android.gms.internal.consent_sdk.** { *; }"
          }
        }
      ],
      // [
      //   "react-native-google-mobile-ads",
      //   {
      //     androidAppId: process.env.EXPO_ANDROID_ADMOB_APP_ID,
      //     iosAppId: process.env.EXPO_IOS_ADMOB_APP_ID,
      //     delayAppMeasurementInit: true,
      //     userTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you."
      //   }
      // ],
      // [
      //   "expo-file-system",
      //   {
      //     supportsOpeningDocumentsInPlace: true,
      //     enableFileSharing: true
      //   }
      // ]
    ]
  }
});
