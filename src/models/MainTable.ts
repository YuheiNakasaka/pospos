export type MainTableColumns = string[]

export type MainTableRecord = { [key: string]: any }

export type MainTableRecords = MainTableRecord[]

export enum MainTableStatus {
  LOADING = 'loading',
  LOADED = 'loaded'
}

export type MainTable = {
  tableSchema: string
  tableName: string
  columns: MainTableColumns
  records: MainTableRecords
  status: MainTableStatus
  allRecordsCount: number
  offset: number
  limit: number
}
