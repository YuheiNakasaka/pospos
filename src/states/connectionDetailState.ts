import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectionConfig } from '../models/ConnectionConfig'
import * as globalStateKey from './globalStateKey'

const connectionDetailRecoilState = atom<ConnectionConfig | null>({
  key: globalStateKey.connectionDetail,
  default: null
})

export const useConnectionDetailState = () => {
  return useRecoilValue(connectionDetailRecoilState)
}

export const useConnectionDetailMutators = () => {
  const setState = useSetRecoilState(connectionDetailRecoilState)

  const addConnectionDetail = useCallback(
    (connectionConfig: ConnectionConfig | null) => {
      setState(connectionConfig)
    },
    [setState]
  )

  const resetConnectionDetail = useCallback(() => {
    setState(null)
  }, [setState])

  return {
    addConnectionDetail,
    resetConnectionDetail
  }
}
