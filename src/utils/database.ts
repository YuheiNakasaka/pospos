import { ConnectionConfig } from '../models/ConnectionConfig'

export const connectionUrl = (config: ConnectionConfig): string => {
  return `postgres://${config.user}:${config.password}@${config.host}/${config.database}?port=${config.port}`
}
