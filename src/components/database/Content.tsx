import { Colors } from '@blueprintjs/core'
import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  Table2
} from '@blueprintjs/table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MainTableColumns, MainTableRecords } from '../../models/MainTable'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import { useMainTableState } from '../../states/mainTableState'
import { updateRecord } from '../../utils/database'
import Footer from './Footer'

const Content = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const mainTableState = useMainTableState()
  const [columns, setColumns] = useState<MainTableColumns>([])
  const [records, setRecords] = useState<MainTableRecords>([])

  const onConfirmUpdateColumn = async (columnName, newValue, rowIndex) => {
    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          const updatedRecords = await updateRecord(
            connectionSet.session,
            mainTableState.tableName,
            columnName,
            newValue,
            typeof records[rowIndex][columnName],
            records[rowIndex]
          )
          setRecords(updatedRecords)
        }
      }
    }
  }

  useEffect(() => {
    if (mainTableState) {
      setColumns(mainTableState.columns)
      setRecords(mainTableState.records)
    }
  }, [mainTableState])

  return (
    <>
      <main
        style={{
          marginTop: '60px',
          width: 'calc(100% - 230px)',
          height: 'calc(100vh - 60px - 30px)',
          overflow: 'scroll',
          flexGrow: 1,
          backgroundColor: Colors.LIGHT_GRAY5
        }}
      >
        <Table2
          numRows={records.length}
          enableRowHeader={false}
          enableMultipleSelection={false}
        >
          {columns.map((columnName, index) => (
            <Column
              key={index}
              columnHeaderCellRenderer={(_: number) => (
                <ColumnHeaderCell2 name={columnName} />
              )}
              cellRenderer={(rowIndex: number, _: number) => {
                let value = records[rowIndex][columnName]
                // NOTE: Array型だるい...
                if (typeof value === 'object' && Array.isArray(value)) {
                  value = `{${value.join(',')}}`
                }
                return (
                  <EditableCell2
                    value={value !== null ? `${value}` : null}
                    onConfirm={(newValue) =>
                      onConfirmUpdateColumn(columnName, newValue, rowIndex)
                    }
                  />
                )
              }}
            />
          ))}
        </Table2>
        <Footer />
      </main>
    </>
  )
}

export default Content
