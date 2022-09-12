import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectionConfig } from '../models/ConnectionConfig'
import { connectionUrl } from '../utils/database'
import * as globalStateKey from './globalStateKey'

const connectionConfigsRecoilState = atom<ConnectionConfig[]>({
  key: globalStateKey.connectionConfigs,
  default: []
})

export const useConnectionConfigsState = () => {
  return useRecoilValue(connectionConfigsRecoilState)
}

export const useConnectionConfigsMutators = () => {
  const setState = useSetRecoilState(connectionConfigsRecoilState)

  const addConnectionConfig = useCallback(
    (connectionConfig: ConnectionConfig) => {
      setState((prev) => [...prev, connectionConfig])
    },
    [setState]
  )

  const removeConnectionConfig = useCallback(
    (connectionConfig: ConnectionConfig) => {
      setState((prev) =>
        prev.filter((c) => connectionUrl(c) !== connectionUrl(connectionConfig))
      )
    },
    [setState]
  )

  return {
    addConnectionConfig,
    removeConnectionConfig
  }
}
