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
