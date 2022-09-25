import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import Database from 'tauri-plugin-sql-api'
import { QueryType } from '../models/Query'
import { QueryTable, QueryTableStatus } from '../models/QueryTable'
import {
  executeQuery,
  fetchColumnsFromTable,
  fetchRecordCountFromTable,
  fetchRecordsFromTable,
  parseQuery,
  selectQuery
} from '../utils/database'
import * as globalStateKey from './globalStateKey'

const queryTableRecoilState = atom<QueryTable | null>({
  key: globalStateKey.queryTable,
  default: null
})

export const useQueryTableState = () => {
  return useRecoilValue(queryTableRecoilState)
}

export const useQueryTableMutators = () => {
  const currentState = useRecoilValue(queryTableRecoilState)
  const setState = useSetRecoilState(queryTableRecoilState)

  const initQueryTable = useCallback(() => {
    setState({
      columns: [],
      records: [],
      status: QueryTableStatus.LOADED,
      allRecordsCount: 0
    })
  }, [setState])

  const addQueryTable = useCallback(
    async (session: Database, rawQuery: string) => {
      const parsedQuery = parseQuery(rawQuery)
      if (parsedQuery.type === QueryType.SELECT) {
        const records = await selectQuery(session, rawQuery)
        if (records.length > 0) {
          const column_names = Object.keys(records[0])
          setState({
            columns: column_names,
            records: records,
            status: QueryTableStatus.LOADED,
            allRecordsCount: records.length
          })
        }
      } else {
        await executeQuery(session, rawQuery)
        setState({
          columns: [],
          records: [],
          status: QueryTableStatus.LOADED,
          allRecordsCount: 0
        })
      }
    },
    [setState]
  )

  const updateQueryTableStatus = useCallback(
    (status: QueryTableStatus) => {
      setState((prev) => {
        return {
          ...prev,
          ...{ status: status }
        }
      })
    },
    [setState]
  )

  return {
    initQueryTable,
    addQueryTable,
    updateQueryTableStatus
  }
}
