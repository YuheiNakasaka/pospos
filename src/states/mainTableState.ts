import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import Database from 'tauri-plugin-sql-api'
import { MainTable } from '../models/MainTable'
import { fetchColumnsFromTable, fetchRecordsFromTable } from '../utils/database'
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
      setState({
        tableName: tableName,
        columns: column_names.map((row) => row['column_name']),
        records: records
      })
    },
    [setState]
  )

  const reloadMainTable = useCallback(async (session: Database) => {
    if (!currentState) return
    const records = await fetchRecordsFromTable(
      session,
      currentState.tableName,
      1000
    )
    setState((prev) => {
      return {
        ...prev,
        ...{ records: records }
      }
    })
  }, [])

  const resetMainTable = useCallback(() => {
    setState(null)
  }, [setState])

  return {
    addMainTable,
    resetMainTable,
    reloadMainTable
  }
}
