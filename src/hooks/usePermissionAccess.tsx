import React, { memo, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

export type PermissionAccessContextType = {
  arePermsLoaded: boolean;
  arePermsEnabled: boolean;
  error: Error | null;
  openSettings: () => Promise<void>;
};

export type PermissionAccessProviderProps = {
  children: React.ReactNode;
  checkPerms: () => Promise<boolean>;
  openPermsSettings: () => Promise<void>;
};

const PermissionAccessContext = createContext<PermissionAccessContextType | null>(null);

/********************************************************************************************************************
 * Create an independent permission-access context.
 *
 * Automatically:
 * - checks access when mounted
 * - checks again whenever the app becomes active
 * 
 * @param checkPerms - function to check whether permissions are currently granted
 * @param openPermsSettings - open the native settings/UI used to grant access
 ********************************************************************************************************************/
export const PermissionAccessProvider: React.FC<PermissionAccessProviderProps> = memo(({
  children,
  checkPerms,
  openPermsSettings
}) => {
  const [arePermsLoaded, setIsPermLoaded] = useState(false);
  const [arePermsEnabled, setIsPermEnabled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Refresh permission state.
   */
  const refresh = useCallback(async () => {
    try {
      const enabled = await checkPerms();
      setIsPermEnabled(enabled);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsPermLoaded(true);
    }
  }, [checkPerms]);

  /**
   * Initial perms check.
   */
  useEffect(() => {
    void refresh();
  }, [refresh]);

  /**
   * Open native permission/access settings.
   * Access will automatically be checked again when the application becomes active.
   */
  const openSettings = useCallback(async () => {
    await openPermsSettings();
  }, [openPermsSettings]);

  /**
   * Re-check after returning from native settings.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        void refresh();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [refresh]);

  /**
   * Context.
   */
  const value = useMemo<PermissionAccessContextType>(() => ({
    arePermsLoaded,
    arePermsEnabled,
    error,
    openSettings
  }),
    [arePermsLoaded, arePermsEnabled, error, openSettings]
  );

  return (
    <PermissionAccessContext.Provider value={value}>
      {children}
    </PermissionAccessContext.Provider>
  );
});

export const usePermissionAccess = (): PermissionAccessContextType => {
  const context = useContext(PermissionAccessContext);
  if (!context) {
    throw new Error('usePermissionAccess must be used within <PermissionAccessProvider>');
  }
  return context;
};