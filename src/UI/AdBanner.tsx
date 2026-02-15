import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAds } from '../Hooks/UseAds';

type AdBannerProps = {
  admobUnitID: string;
  // use "ADAPTIVE_BANNER" so it matches screen width
  size?: BannerAdSize;
};

/******************************************************************************************************************
 * AdBanner
 * - Uses test ID in dev
 * - Uses your real ad unit id in production
 *
 * NOTE: Banner ad unit IDs are NOT the same as "App IDs" used in app.config.js.
 ******************************************************************************************************************/
const AdBanner: React.FC<AdBannerProps> = ({
  admobUnitID,
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER
}) => {
  const { canRequestAds } = useAds();
  const adUnitId = __DEV__ ? TestIds.BANNER : admobUnitID;

  if (!canRequestAds) return null;

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AdBanner);