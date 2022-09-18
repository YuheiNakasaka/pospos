import { Colors } from '@blueprintjs/core'
import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  EditableName,
  Table2
} from '@blueprintjs/table'
import { useEffect, useState } from 'react'
import { MainTableColumns, MainTableRecords } from '../../models/MainTable'
import { useMainTableState } from '../../states/mainTableState'

const Content = () => {
  const mainTableState = useMainTableState()
  const [columns, setColumns] = useState<MainTableColumns>([])
  const [records, setRecords] = useState<MainTableRecords>([])

  useEffect(() => {
    if (mainTableState) {
      setColumns(mainTableState.columns)
      setRecords(mainTableState.records)
    }
  }, [mainTableState])

  return (
    <main
      style={{
        marginTop: '60px',
        width: 'calc(100% - 230px)',
        height: 'calc(100vh - 60px - 20px)',
        overflow: 'scroll',
        flexGrow: 1,
        backgroundColor: Colors.LIGHT_GRAY5
      }}
    >
      {records.length > 0 && (
        <Table2
          numRows={records.length}
          enableRowHeader={false}
          enableMultipleSelection={false}
        >
          {columns.map((columnName, index) => (
            <Column
              key={index}
              cellRenderer={(rowIndex: number, columnIndex: number) => {
                const value = records[rowIndex][columnName]
                return <EditableCell2 value={value ? value.toString() : ''} />
              }}
              columnHeaderCellRenderer={(columnIndex: number) => (
                <ColumnHeaderCell2
                  name={columnName}
                  nameRenderer={(name: string) => <EditableName name={name} />}
                />
              )}
            />
          ))}
        </Table2>
      )}
    </main>
  )
}

export default Content
