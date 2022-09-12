import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { ConnectionConfig } from '../models/ConnectionConfig'
import { connectionUrl, isSameConnectionConfig } from '../utils/database'
import * as globalStateKey from './globalStateKey'
import Database from 'tauri-plugin-sql-api'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : window.localStorage
})

const connectionConfigsRecoilState = atom<ConnectionConfig[]>({
  key: globalStateKey.connectionConfigs,
  default: [],
  effects_UNSTABLE: [persistAtom]
})

export const useConnectionConfigsState = () => {
  return useRecoilValue(connectionConfigsRecoilState)
}

export const useConnectionConfigsMutators = () => {
  const setState = useSetRecoilState(connectionConfigsRecoilState)

  const updateConnectionConfig = useCallback(
    async (
      newConnectionConfig: ConnectionConfig,
      oldConnectionConfig: ConnectionConfig | null = null
    ): Promise<boolean> => {
      // NOTE: validConnection is a bit slow, so deleyed the execution as much as possible
      if (validFields(newConnectionConfig)) {
        const isValidConnection = await validConnection(newConnectionConfig)
        if (isValidConnection) {
          setState((prev) => {
            // UPDATE
            if (oldConnectionConfig) {
              const newState = prev.map((c) =>
                isSameConnectionConfig(c, oldConnectionConfig)
                  ? newConnectionConfig
                  : c
              )
              return [...newState]
            } else {
              // ADD
              return [...prev, newConnectionConfig]
            }
          })
          return true
        }
      }
      return false
    },
    [setState]
  )

  const deleteConnectionConfig = useCallback(
    (targetConnectionConfig: ConnectionConfig) => {
      setState((prev) =>
        prev.filter((c) => !isSameConnectionConfig(c, targetConnectionConfig))
      )
    },
    [setState]
  )

  return {
    updateConnectionConfig,
    deleteConnectionConfig
  }
}

const validFields = (connectionConfig: ConnectionConfig) => {
  if (
    connectionConfig.name &&
    connectionConfig.host &&
    connectionConfig.user &&
    connectionConfig.database &&
    connectionConfig.port
  ) {
    return true
  }
  return false
}

// Close the connection test if 6 seconds have passed
const validConnection = async (connectionConfig: ConnectionConfig) => {
  try {
    const promise1 = new Promise(async (resolve, _) => {
      await Database.load(connectionUrl(connectionConfig))
      resolve(true)
    })
    const promise2 = new Promise(async (resolve, _) => {
      setTimeout(() => resolve(false), 6000)
    })
    const result = await Promise.race([promise1, promise2])
    return !!result
  } catch (error) {
    console.error(JSON.stringify(error))
    return false
  }
}
