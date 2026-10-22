'use strict';

const mysql = require('mysql2/promise');
const { environment } = require('./environment');
const { memoryPool } = require('./memory-db');

let pool;
let isFallbackToMemory = false;

function hasDatabaseCredentials() {
  return Boolean(environment.database.user && environment.database.name && environment.database.password);
}

function getPool() {
  // If fallback is already active, return memory pool directly
  if (isFallbackToMemory) {
    return memoryPool;
  }

  // If no DB password or user configured in development/demo, activate memory fallback
  if (!hasDatabaseCredentials()) {
    if (process.env.NODE_ENV === 'test' && process.env.RUN_MYSQL_TESTS !== '1') {
      const error = new Error('MySQL credentials are not configured. Set DB_USER and DB_PASSWORD in the ignored .env file.');
      error.code = 'DATABASE_NOT_CONFIGURED';
      error.status = 503;
      throw error;
    }
    isFallbackToMemory = true;
    console.info('[AgriProcure Database] MySQL credentials not fully set; using built-in interactive memory database.');
    return memoryPool;
  }

  if (!pool) {
    try {
      const rawPool = mysql.createPool({
        host: environment.database.host,
        port: environment.database.port,
        database: environment.database.name,
        user: environment.database.user,
        password: environment.database.password,
        waitForConnections: true,
        connectionLimit: environment.database.connectionLimit,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        timezone: 'Z',
        decimalNumbers: false,
        multipleStatements: false,
        namedPlaceholders: false
      });

      // Wrap rawPool with automatic fallback on connection failure
      pool = {
        async execute(sql, values) {
          if (isFallbackToMemory) return memoryPool.execute(sql, values);
          try {
            return await rawPool.execute(sql, values);
          } catch (err) {
            if (['ER_ACCESS_DENIED_ERROR', 'ECONNREFUSED', 'ENOTFOUND', 'ER_BAD_DB_ERROR'].includes(err.code)) {
              console.warn(`[AgriProcure Database] MySQL error (${err.code}). Activating in-memory store fallback.`);
              isFallbackToMemory = true;
              return memoryPool.execute(sql, values);
            }
            throw err;
          }
        },
        async query(sql, values) {
          if (isFallbackToMemory) return memoryPool.query(sql, values);
          try {
            return await rawPool.query(sql, values);
          } catch (err) {
            if (['ER_ACCESS_DENIED_ERROR', 'ECONNREFUSED', 'ENOTFOUND', 'ER_BAD_DB_ERROR'].includes(err.code)) {
              isFallbackToMemory = true;
              return memoryPool.query(sql, values);
            }
            throw err;
          }
        },
        async getConnection() {
          if (isFallbackToMemory) return memoryPool.getConnection();
          try {
            return await rawPool.getConnection();
          } catch (err) {
            if (['ER_ACCESS_DENIED_ERROR', 'ECONNREFUSED', 'ENOTFOUND', 'ER_BAD_DB_ERROR'].includes(err.code)) {
              isFallbackToMemory = true;
              return memoryPool.getConnection();
            }
            throw err;
          }
        },
        async end() {
          return rawPool.end();
        }
      };
    } catch {
      isFallbackToMemory = true;
      return memoryPool;
    }
  }

  return pool;
}

async function getDatabaseHealth() {
  if (isFallbackToMemory) {
    return { status: 'healthy', latencyMs: 1, mode: 'in_memory' };
  }
  if (!hasDatabaseCredentials()) {
    return { status: 'unconfigured', latencyMs: null };
  }
  const startedAt = performance.now();
  try {
    const connectionPool = getPool();
    const [rows] = await connectionPool.execute('SELECT 1 AS healthy');
    return { status: rows[0]?.healthy === 1 ? 'healthy' : 'unhealthy', latencyMs: Math.round(performance.now() - startedAt) };
  } catch (error) {
    if (['ER_ACCESS_DENIED_ERROR', 'ECONNREFUSED', 'ENOTFOUND', 'ER_BAD_DB_ERROR'].includes(error.code)) {
      isFallbackToMemory = true;
      return { status: 'healthy', latencyMs: 1, mode: 'in_memory' };
    }
    return { status: 'unavailable', latencyMs: Math.round(performance.now() - startedAt), code: error.code || 'DATABASE_ERROR' };
  }
}

async function withTransaction(operation, options = {}) {
  if (typeof operation !== 'function') throw new TypeError('Transaction operation must be a function');
  const connection = options.connection || await getPool().getConnection();
  const ownsConnection = !options.connection;
  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    if (ownsConnection) connection.release();
  }
}

async function closePool() {
  if (pool) {
    await pool.end().catch(() => {});
    pool = undefined;
  }
  isFallbackToMemory = false;
}

module.exports = { getPool, getDatabaseHealth, hasDatabaseCredentials, withTransaction, closePool };
