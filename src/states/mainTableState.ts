import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { MainTable } from '../models/MainTable'
import * as globalStateKey from './globalStateKey'

const mainTableRecoilState = atom<MainTable | null>({
  key: globalStateKey.mainTable,
  default: null
})

export const useMainTableState = () => {
  return useRecoilValue(mainTableRecoilState)
}

export const useMainTableMutators = () => {
  const setState = useSetRecoilState(mainTableRecoilState)

  const addMainTable = useCallback(
    (mainTable: MainTable | null) => {
      console.log(`mainTable: ${JSON.stringify(mainTable)}`)
      setState(mainTable)
    },
    [setState]
  )

  const resetMainTable = useCallback(() => {
    setState(null)
  }, [setState])

  return {
    addMainTable,
    resetMainTable
  }
}
