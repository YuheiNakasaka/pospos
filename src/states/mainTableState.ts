import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import Database from 'tauri-plugin-sql-api'
import { MainTable, MainTableStatus } from '../models/MainTable'
import {
  fetchColumnsFromTable,
  fetchRecordCountFromTable,
  fetchRecordsFromTable
} from '../utils/database'
import * as globalStateKey from './globalStateKey'

const mainTableRecoilState = atom<MainTable | null>({
  key: globalStateKey.mainTable,
  default: null
})

export const useMainTableState = () => {
  return useRecoilValue(mainTableRecoilState)
}

export const useMainTableMutators = () => {
  const currentState = useRecoilValue(mainTableRecoilState)
  const setState = useSetRecoilState(mainTableRecoilState)

  const addMainTable = useCallback(
    async (session: Database, tableName: string) => {
      const column_names = await fetchColumnsFromTable(session, tableName)
      const records = await fetchRecordsFromTable(session, tableName, 1000)
      const count = await fetchRecordCountFromTable(session, tableName)
      setState({
        tableName: tableName,
        columns: column_names.map((row) => row['column_name']),
        records: records,
        status: MainTableStatus.LOADED,
        allRecordsCount: count,
        offset: 0,
        limit: 1000
      })
    },
    [setState]
  )

  const reloadMainTable = useCallback(
    async (session: Database, limit: number, offset: number) => {
      if (!currentState) return
      const records = await fetchRecordsFromTable(
        session,
        currentState.tableName,
        limit,
        offset
      )
      setState((prev) => {
        return {
          ...prev,
          ...{ records: records, status: MainTableStatus.LOADED }
        }
      })
    },
    [setState, currentState]
  )

  const resetMainTable = useCallback(() => {
    setState(null)
  }, [setState])

  const updateMainTableStatus = useCallback(
    (status: MainTableStatus) => {
      setState((prev) => {
        return {
          ...prev,
          ...{ status: status }
        }
      })
    },
    [setState]
  )

  const updateMainTableStatusLimit = useCallback(
    (limit: number) => {
      setState((prev) => {
        return { ...prev, ...{ limit: limit } }
      })
    },
    [setState]
  )

  const updateMainTableStatusOffset = useCallback(
    (offset: number) => {
      setState((prev) => {
        return { ...prev, ...{ offset: offset } }
      })
    },
    [setState]
  )

  return {
    addMainTable,
    resetMainTable,
    reloadMainTable,
    updateMainTableStatus,
    updateMainTableStatusLimit,
    updateMainTableStatusOffset
  }
}
