export type MainTableColumns = string[]

export type MainTableRecord = { [key: string]: any }

export type MainTableRecords = MainTableRecord[]

export type MainTable = {
  tableName: string
  columns: MainTableColumns
  records: MainTableRecords
}
