import * as SQLite from 'expo-sqlite';

export type SQLiteDatabase = SQLite.SQLiteDatabase;

type DatabaseInitializer = (db: SQLiteDatabase) => Promise<void>;

type DatabaseConfig = {
  name: string;
  initialize: DatabaseInitializer;
};

let databaseConfig: DatabaseConfig | null = null;
let databasePromise: Promise<SQLiteDatabase> | null = null;

/**
 * Configures the application database.
 * Must be called before getDatabase().
 * 
 * @param name - database name to create in Expo SQLite default dir
 * @param initialize - function to initialize database with schema
 * 
 */
export function setupDatabase(name: string, initialize: DatabaseInitializer): void {
  if (databasePromise !== null) {
    throw new Error('Cannot configure database after it has been opened.');
  }

  databaseConfig = { name, initialize };
}

/**
 * Gets the singleton application database instance.
 * Creates and initializes the database on first access.
 *
 * @returns singleton database instance
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  const config = getDatabaseConfig();

  if (databasePromise === null) {
    databasePromise = initializeDatabase(config.name, config.initialize);
  }

  return databasePromise;
}

/**
 * Deletes the application database.
 * The registered database configuration is preserved, so a subsequent getDatabase() will recreate the database.
 */
export async function deleteDatabase(): Promise<void> {
  const config = getDatabaseConfig();

  try {
    if (databasePromise !== null) {
      const db = await databasePromise;
      await db.closeAsync();
    }

    databasePromise = null;

    await SQLite.deleteDatabaseAsync(config.name);
  } catch (e) {
    databasePromise = null;
    throw new Error(`Failed to delete database '${config.name}': ${e}`);
  }
}

/**
 * Creates and initializes a temporary database using the registered application schema.
 * The connection is closed before returning so another layer, such as a Kotlin native module, can safely open the file.
 *
 * @param databaseName - temporary database name
 *
 * @returns absolute path of initialized database
 */
export async function createTempDatabase(databaseName: string): Promise<string> {
  const config = getDatabaseConfig();

  const db = await initializeDatabase(databaseName, config.initialize);

  try {
    return db.databasePath;
  } finally {
    await db.closeAsync();
  }
}

/**
 * Deletes a temporary database by name.
 * The database must not currently have any open connections.
 * 
 * @param databaseName - temporary database name to delete
 */
export async function deleteTempDatabase(databaseName: string): Promise<void> {
  try {
    await SQLite.deleteDatabaseAsync(databaseName);
  } catch (e) {
    throw new Error(`Failed to delete database '${databaseName}': ${e}`);
  }
}

/**
 * Retrieves the registered database configuration.
 * 
 * @returns the database config
 */
function getDatabaseConfig(): DatabaseConfig {
  if (databaseConfig === null) {
    throw new Error('Database has not been configured. Call setupDatabase() first.');
  }

  return databaseConfig;
}

/**
 * Opens or creates and initializes a database. Internal helper.
 * 
 * @param name - database name to create in Expo SQLite default dir
 * @param initialize - function to initialize database with schema
 * 
 * @returns the SQLite database instance
 */
async function initializeDatabase(databaseName: string, initialize: DatabaseInitializer): Promise<SQLiteDatabase> {
  let db: SQLiteDatabase | null = null;

  try {
    db = await SQLite.openDatabaseAsync(databaseName);

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
        // preserve original initialization error
      }
    }

    throw new Error(`Failed to initialize database '${databaseName}': ${e}`);
  }
}