import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import mobileAds, {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

export type AdsContextType = {
  // flags
  isInitialized: boolean;
  canRequestAds: boolean;
  consentStatus: AdsConsentStatus | null;
  error: string | null;

  // called once on app start (AdsProvider auto-calls this)
  startAdSDK: () => Promise<void>;

  // dev/testing helpers (safe no-ops in prod)
  debugResetConsent: () => Promise<void>;
};

const AdsContext = createContext<AdsContextType | null>(null);

/********************************************************************************************************************
 * AdsProvider:
 * - Gather GDPR/EEA consent if required (shows consent form).
 * - Track canRequestAds state.
 * - Initialize Google Mobile Ads SDK once when allowed.
 *
 * Notes:
 * - `delayAppMeasurementInit: true` should be set in app.config.js plugin config
 *   so measurement is delayed until consent is settled.
 ********************************************************************************************************************/
export const AdsProvider: React.FC<{
  umpId?: string, // UMP test device identifier used for consent debugging
  children: React.ReactNode
}> = memo(({ umpId, children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [canRequestAds, setCanRequestAds] = useState(false);
  const [consentStatus, setConsentStatus] = useState<AdsConsentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  /******************************************************************************************************************
   * Consent info logic:
   * - Set can request ads bool
   * - Set consent status state
   ******************************************************************************************************************/
  const readConsentInfo = useCallback(async () => {
    const info = await AdsConsent.getConsentInfo();
    setCanRequestAds(info.canRequestAds);
    setConsentStatus(info.status);
    return info;
  }, []);

  /******************************************************************************************************************
   * Start ad sdk:
   * - Called once at app start (auto-called inside provider)
   ******************************************************************************************************************/
  const startAdSDK = useCallback(async () => {
    setError(null);

    /**
     * 1) Gather consent FIRST (this may show the consent form in EEA or debug EEA)
     */
    const debugOptions =
      __DEV__ && umpId
        ? {
          debugGeography: AdsConsentDebugGeography.EEA,
          testDeviceIdentifiers: [umpId],
        }
        : undefined;

    try {
      // IMPORTANT: pass debugOptions so gatherConsent doesn't overwrite EEA debug setup
      await AdsConsent.gatherConsent(debugOptions);
    } catch (e: any) {
      // keep going: we might still have stored consent from previous session
      setError(e?.message ?? 'Consent gathering failed');
    }

    /**
     * 2) Read consent info AFTER gatherConsent so canRequestAds is up-to-date
     */
    const info = await readConsentInfo();

    // init only if can request ads
    if (!info.canRequestAds) return;

    /**
     * 3) Init Google Mobile Ads SDK
     */
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    await mobileAds().initialize();
    setIsInitialized(true);
  }, [readConsentInfo]);

  /******************************************************************************************************************
   * Debug functions:
   * - After calling these, call startAdSDK again
   ******************************************************************************************************************/
  const debugResetConsent = useCallback(async () => {
    if (__DEV__) {
      AdsConsent.reset();
      setIsInitialized(false);
      setCanRequestAds(false);
      setConsentStatus(null);
      setError(null);
    }
  }, []);

  /******************************************************************************************************************
   * Auto-init on provider mount
   ******************************************************************************************************************/
  useEffect(() => {
    const run = async () => {
      // await debugResetConsent();
      await startAdSDK();
    };
    run();
  }, [startAdSDK, debugResetConsent]);

  const value = useMemo<AdsContextType>(
    () => ({
      isInitialized, canRequestAds, consentStatus, error,
      startAdSDK,
      debugResetConsent
    }),
    [
      isInitialized,
      canRequestAds,
      consentStatus,
      error,
      startAdSDK,
      debugResetConsent,
    ],
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
});

/********************************************************************************************************************
 * useAds
 * - Shared ads state from context
 ********************************************************************************************************************/
export const useAds = (): AdsContextType => {
  const ctx = useContext(AdsContext);
  if (!ctx) {
    throw new Error('useAds must be used within <AdsProvider>');
  }
  return ctx;
};
