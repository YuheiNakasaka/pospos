export type QueryTableColumns = string[]

export type QueryTableRecord = { [key: string]: any }

export type QueryTableRecords = QueryTableRecord[]

export enum QueryTableStatus {
  LOADING = 'loading',
  LOADED = 'loaded'
}

export type QueryTable = {
  columns: QueryTableColumns
  records: QueryTableRecords
  status: QueryTableStatus
  allRecordsCount: number
}
