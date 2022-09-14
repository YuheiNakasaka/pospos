import Database from 'tauri-plugin-sql-api'
import { ConnectionConfig } from './ConnectionConfig'

export type ConnectionSet = {
  session: Database | null
  config: ConnectionConfig | null
}

export type ConnectionRegistry = {
  [key: string]: ConnectionSet
}
