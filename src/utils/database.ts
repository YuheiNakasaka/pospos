import Database, { QueryResult } from 'tauri-plugin-sql-api'
import { ConnectionConfig } from '../models/ConnectionConfig'
import { MainTableRecord } from '../models/MainTable'

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
    "SELECT * FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name"
  )
}

export const fetchRecordsFromTable = async (
  session: Database,
  tableName: string,
  limit = 100
): Promise<{ [key: string]: string }[]> => {
  return await session.select(`SELECT * FROM ${tableName} LIMIT ${limit}`)
}

export const fetchColumnsFromTable = async (
  session: Database,
  tableName: string
): Promise<{ [key: string]: string }[]> => {
  return await session.select(
    `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`
  )
}

export const updateRecord = async (
  session: Database,
  tableName: string,
  key: string,
  value: any,
  type: string,
  record: MainTableRecord
): Promise<{ [key: string]: string }[]> => {
  const whereClauses = Object.keys(record)
    .map((k) => whereClause(k, record[k]))
    .join(' AND ')
  await session.execute(
    `UPDATE ${tableName} SET ${key} = ${typedValue(
      value,
      type
    )} WHERE ${whereClauses}`
  )
  return fetchRecordsFromTable(session, tableName)
}

const whereClause = (columnName: string, value: any) => {
  if (value === null) {
    return `${columnName} IS NULL`
  } else {
    return `${columnName} = ${typedValue(value, typeof value)}`
  }
}

const typedValue = (value: any, type: string): string | number | boolean => {
  console.log(value, type)
  switch (type) {
    case 'string':
      return `'${value}'`
    case 'number':
      return Number(value)
    case 'boolean':
      return value === true ? true : false
    case 'object':
      if (value === null) return null
      return `'${value}'`
    default:
      return `'${value}'`
  }
}
