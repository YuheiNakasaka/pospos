import Database, { QueryResult } from 'tauri-plugin-sql-api'
import { ConnectionConfig } from '../models/ConnectionConfig'
import { MainTableRecord } from '../models/MainTable'
import { Query, QueryType } from '../models/Query'
import { jsValueToSqlValidValue } from './valueConverter'

export const connectionUrl = (
  config: ConnectionConfig,
  schema = 'public'
): string => {
  return `postgres://${config.user}:${config.password}@${config.host}/${config.database}?port=${config.port}&schema=${schema}`
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
  session: Database,
  tableSchema: string
): Promise<{ [key: string]: string }[]> => {
  return await session.select(
    `SELECT * FROM information_schema.tables WHERE table_schema='${tableSchema}' AND table_type='BASE TABLE' ORDER BY table_name`
  )
}

export const fetchAllSchemas = async (
  session: Database
): Promise<{ [key: string]: string }[]> => {
  return await session.select(
    `SELECT schema_name FROM information_schema.schemata`
  )
}

export const fetchRecordsFromTable = async (
  session: Database,
  tableName: string,
  tableSchema: string,
  limit = 100,
  offset = 0
): Promise<{ [key: string]: string }[]> => {
  return await session.select(
    `SELECT * FROM ${tableSchema}.${tableName} LIMIT ${limit} OFFSET ${offset}`
  )
}

export const fetchRecordCountFromTable = async (
  session: Database,
  tableName: string,
  tableSchema: string
): Promise<number> => {
  const record: { [key: string]: string }[] = await session.select(
    `SELECT count(*) as count FROM ${tableSchema}.${tableName}`
  )
  return Number(record[0]['count'])
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
  tableSchema: string,
  key: string,
  value: any,
  type: string,
  record: MainTableRecord
): Promise<{ [key: string]: string }[]> => {
  const whereClauses = Object.keys(record)
    .map((k) => whereClause(k, record[k]))
    .join(' AND ')
  await session.execute(
    `UPDATE ${tableSchema}.${tableName} SET ${key} = ${jsValueToSqlValidValue(
      value,
      type
    )} WHERE ${whereClauses}`
  )
  return fetchRecordsFromTable(session, tableName, tableSchema)
}

export const selectQuery = async (
  session: Database,
  query: string
): Promise<{ [key: string]: string }[]> => {
  return await session.select(query)
}

export const executeQuery = async (
  session: Database,
  query: string
): Promise<QueryResult> => {
  return await session.execute(query)
}

// TODO: This is a temporary solution. We need to find a way to get the type of the column.
export const parseQuery = (query: string): Query => {
  const queryParts = query.split(' ')
  console.log(queryParts)
  const queryType = queryParts[0].toLowerCase()
  console.log(queryType)
  return {
    type: queryType === 'select' ? QueryType.SELECT : QueryType.OTHER
  }
}

const whereClause = (columnName: string, value: any) => {
  if (value === null) {
    return `${columnName} IS NULL`
  } else {
    return `${columnName} = ${jsValueToSqlValidValue(value, typeof value)}`
  }
}
