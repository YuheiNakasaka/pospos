export type MainTableColumns = string[]

export type MainTableRecords = { [key: string]: string }[]

export type MainTable = {
  columns: MainTableColumns
  records: MainTableRecords
}
