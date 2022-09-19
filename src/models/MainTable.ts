export type MainTableColumns = string[]

export type MainTableRecord = { [key: string]: any }

export type MainTableRecords = MainTableRecord[]

export enum MainTableStatus {
  LOADING = 'loading',
  LOADED = 'loaded'
}

export type MainTable = {
  tableName: string
  columns: MainTableColumns
  records: MainTableRecords
  status: MainTableStatus
  allRecordsCount: number
}
