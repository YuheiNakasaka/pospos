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

  const initMainTable = useCallback(() => {
    setState({
      tableName: '',
      columns: [],
      records: [],
      status: MainTableStatus.LOADED,
      allRecordsCount: 0,
      offset: 0,
      limit: 1000,
      tableSchema: 'public'
    })
  }, [setState])

  const addMainTable = useCallback(
    async (session: Database, tableName: string, tableSchema: string) => {
      const column_names = await fetchColumnsFromTable(session, tableName)
      const records = await fetchRecordsFromTable(
        session,
        tableName,
        tableSchema,
        1000
      )
      const count = await fetchRecordCountFromTable(
        session,
        tableName,
        tableSchema
      )
      setState({
        tableName: tableName,
        columns: column_names.map((row) => row['column_name']),
        records: records,
        status: MainTableStatus.LOADED,
        allRecordsCount: count,
        offset: 0,
        limit: 1000,
        tableSchema: tableSchema
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
        currentState.tableSchema,
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

  const updateMainTableSchema = useCallback(
    (tableSchema: string) => {
      setState((prev) => {
        return { ...prev, ...{ tableSchema: tableSchema } }
      })
    },
    [setState]
  )

  return {
    initMainTable,
    addMainTable,
    resetMainTable,
    reloadMainTable,
    updateMainTableStatus,
    updateMainTableStatusLimit,
    updateMainTableStatusOffset,
    updateMainTableSchema
  }
}
