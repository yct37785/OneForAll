import React, { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { SQLiteInitializer } from './SQLite';
import { configureDatabase, getDatabase, resetDatabase } from './SQLite';

export type SQLiteContextType = {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  reset: () => Promise<void>;
};

const SQLiteContext = createContext<SQLiteContextType | null>(null);

/********************************************************************************************************************
 * Global application SQLite provider to:
 *  - Configure global database.
 *  - Load database on startup.
 *  - Manage UI-relevant state.
 * 
 * @prop name - the global database name
 * @prop initialize - function that receives the DB instance to carry out initialization (create tables etc)
 ********************************************************************************************************************/
export const SQLiteProvider: React.FC<{
  name: string;
  initialize: SQLiteInitializer;
  children: React.ReactNode;
}> = memo(({ name, initialize, children }) => {

  /**
   * Configure synchronously so repositories beneath this provider can immediately call getDatabase().
   */
  configureDatabase(name, initialize);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadingRef = useRef(false);

  /**
   * First load.
   */
  useEffect(() => {
    const load = async () => {
      loadingRef.current = true;

      setIsLoading(true);
      setError(null);

      try {
        await getDatabase();
        setIsLoaded(true);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };
    void load();
  }, []);

  /**
   * Reset database.
   * UI layer should call this function to reset database so that the loading flag reflects current state.
   */
  const reset = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;

    setIsLoading(true);
    setIsLoaded(false);
    setError(null);

    try {
      await resetDatabase();
      setIsLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, []);

  /**
   * Context.
   */
  const value = useMemo<SQLiteContextType>(
    () => ({ isLoaded, isLoading, error, reset }),
    [isLoaded, isLoading, error, reset]
  );

  return (
    <SQLiteContext.Provider value={value}>
      {children}
    </SQLiteContext.Provider>
  );
});

/********************************************************************************************************************
 * Access shared application SQLite state.
 ********************************************************************************************************************/
export const useSQLite = (): SQLiteContextType => {
  const ctx = useContext(SQLiteContext);

  if (!ctx) {
    throw new Error('useSQLite must be used within <SQLiteProvider>');
  }

  return ctx;
};