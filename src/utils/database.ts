import Database from 'tauri-plugin-sql-api'
import { ConnectionConfig } from '../models/ConnectionConfig'

export const connectionUrl = (config: ConnectionConfig): string => {
  return `postgres://${config.user}:${config.password}@${config.host}/${config.database}?port=${config.port}`
}

export const isSameConnectionConfig = (
  x: ConnectionConfig,
  y: ConnectionConfig
) => {
  return (
    x.host === y.host &&
    x.port === y.port &&
    x.user === y.user &&
    x.database === y.database &&
    x.password === y.password &&
    x.name === y.name
  )
}

// This uniqueDbKey is used to identify and manage each database connections.
export const uniqueDbKey = async (
  config: ConnectionConfig
): Promise<string> => {
  const message = `${config.name}${config.user}:${config.password}${config.host}${config.database}${config.port}`
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(message))
  const buf = await crypto.subtle.digest('SHA-256', data)
  const arr = Array.from(new Uint8Array(buf))
  return arr.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const fetchAllTables = async (
  session: Database
): Promise<{ [key: string]: string }[]> => {
  return await session.select(
    "SELECT * FROM information_schema.tables  WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name"
  )
}

export const fetchRecordsFromTable = async (
  session: Database,
  tableName: string
): Promise<{ [key: string]: string }[]> => {
  return await session.select(`SELECT * FROM ${tableName} LIMIT 100`)
}
