import * as SQLite from 'expo-sqlite';

export type SQLiteDatabase = SQLite.SQLiteDatabase;

export type SQLiteInitializer = (db: SQLiteDatabase) => Promise<void>;

type SQLiteConfig = {
  name: string;
  initialize: SQLiteInitializer;
};

/********************************************************************************************************************
 * Global singleton
 ********************************************************************************************************************/
let databaseConfig: SQLiteConfig | null = null;
let databasePromise: Promise<SQLiteDatabase> | null = null;

/********************************************************************************************************************
 * Internal helpers
 ********************************************************************************************************************/

/**
 * Register application database configuration.
 * Called synchronously by SQLiteProvider so getDatabase() is safe to use anywhere beneath the provider.
 * 
 * @param name - database name
 * @param initialize - function to receive DB instance to initialize (create tables etc.)
 * 
 * @throws config already registered with a different database name
 */
export function configureDatabase(name: string, initialize: SQLiteInitializer): void {
  if (databaseConfig === null) {
    databaseConfig = { name, initialize };
    return;
  }

  if (databaseConfig.name !== name) {
    throw new Error(`SQLite already configured as '${databaseConfig.name}'.`);
  }
}

/**
 * Retrieve registered database config safely.
 * 
 * @returns configuration object
 * 
 * @throws if no config set
 */
function getDatabaseConfig(): SQLiteConfig {
  if (databaseConfig === null) {
    throw new Error('SQLite has not been configured. Wrap the app in <SQLiteProvider>.');
  }
  return databaseConfig;
}

/**
 * Opens and initializes a SQLite database.
 * 
 * @param name - database name that was registered
 * @param initialize - function to receive DB instance to initialize
 * 
 * @returns DB instance
 * 
 * @throws initialization fail
 */
async function openDatabase(name: string, initialize: SQLiteInitializer): Promise<SQLiteDatabase> {
  let db: SQLiteDatabase | null = null;

  try {
    db = await SQLite.openDatabaseAsync(name);

    // improve concurrent TS/native access
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      PRAGMA foreign_keys = ON;
    `);

    await initialize(db);
    return db;
  } catch (e) {
    if (db !== null) {
      try {
        await db.closeAsync();
      } catch {
        // preserve original error
      }
    }
    throw new Error(`Failed to initialize database '${name}': ${e}`);
  }
}

/********************************************************************************************************************
 * Public imperative API
 *
 * Used by repositories/services that cannot use React hooks.
 ********************************************************************************************************************/

/**
 * Get application singleton database. Opens and initializes it on first access.
 * 
 * @returns DB instance
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  const config = getDatabaseConfig();

  if (databasePromise === null) {
    databasePromise = openDatabase(config.name, config.initialize)
      .catch(e => {
        // allow future calls to retry
        databasePromise = null;
        throw e;
      });
  }

  return databasePromise;
}

/**
 * Creates a temp database using the application's schema.
 * 
 * @param name - temp database name (must be different from singleton version)
 * 
 * @returns temp database path
 */
export async function createTempDatabase(name: string): Promise<string> {
  const config = getDatabaseConfig();
  const db = await openDatabase(name, config.initialize);

  try {
    return db.databasePath;
  } finally {
    await db.closeAsync();
  }
}

/**
 * Deletes a temp database.
 * 
 * @param name - temp database name
 */
export async function deleteTempDatabase(name: string): Promise<void> {
  await SQLite.deleteDatabaseAsync(name);
}

/**
 * Deletes and recreates the application database.
 * 
 * @returns DB instance
 */
export async function resetDatabase(): Promise<SQLiteDatabase> {
  const config = getDatabaseConfig();

  let db: SQLiteDatabase | null = null;

  if (databasePromise !== null) {
    try {
      db = await databasePromise;
    } catch {
      // failed initialization already cleaned its connection
    }
  }

  databasePromise = null;

  if (db !== null) {
    await db.closeAsync();
  }

  await SQLite.deleteDatabaseAsync(config.name);

  return await getDatabase();
}
