import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import Database from 'tauri-plugin-sql-api'
import { ConnectionConfig } from '../models/ConnectionConfig'
import { ConnectionRegistry } from '../models/ConnectionRegistry'
import { connectionUrl, uniqueDbKey } from '../utils/database'
import * as globalStateKey from './globalStateKey'

const connectionRegistryRecoilState = atom<ConnectionRegistry | null>({
  key: globalStateKey.connectionRegistry,
  default: null
})

export const useConnectionRegistryState = () => {
  return useRecoilValue(connectionRegistryRecoilState)
}

export const useConnectionRegistryMutators = () => {
  const currentState = useRecoilValue(connectionRegistryRecoilState)
  const setState = useSetRecoilState(connectionRegistryRecoilState)

  const addConnectionRegistry = useCallback(
    async (
      connectionConfig: ConnectionConfig,
      db: Database | null
    ): Promise<string | null> => {
      if (!connectionConfig) return
      const key = await uniqueDbKey(connectionConfig)
      setState((prev) => {
        return {
          ...prev,
          ...{ [key]: { session: db, config: connectionConfig } }
        }
      })
      return key
    },
    [setState]
  )

  const setupConnectionRegistry = useCallback(
    async (key: string): Promise<Database | null> => {
      if (key === '') return
      const connectionRegistry = currentState[key]
      const session = await Database.load(
        connectionUrl(connectionRegistry.config)
      )
      setState((prev) => {
        return {
          ...prev,
          ...{
            [key]: {
              session: session,
              config: connectionRegistry.config
            }
          }
        }
      })
      return session
    },
    [setState]
  )

  return {
    addConnectionRegistry,
    setupConnectionRegistry
  }
}
