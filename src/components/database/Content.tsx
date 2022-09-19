import { Colors } from '@blueprintjs/core'
import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  Table2,
  TableLoadingOption
} from '@blueprintjs/table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  MainTableColumns,
  MainTableRecords,
  MainTableStatus
} from '../../models/MainTable'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  useMainTableMutators,
  useMainTableState
} from '../../states/mainTableState'
import { updateRecord } from '../../utils/database'
import { sqlValueToJsValidValue } from '../../utils/valueConverter'
import Footer from './Footer'

const Content = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const mainTableState = useMainTableState()
  const { updateMainTableStatus } = useMainTableMutators()
  const [columns, setColumns] = useState<MainTableColumns>([])
  const [records, setRecords] = useState<MainTableRecords>([])

  const onConfirmUpdateColumn = async (columnName, newValue, rowIndex) => {
    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (
          connectionSet &&
          connectionSet.session &&
          records[rowIndex][columnName] !== newValue
        ) {
          updateMainTableStatus(MainTableStatus.LOADING)
          const updatedRecords = await updateRecord(
            connectionSet.session,
            mainTableState.tableName,
            mainTableState.tableSchema,
            columnName,
            newValue,
            typeof records[rowIndex][columnName],
            records[rowIndex]
          )
          setRecords(updatedRecords)
          updateMainTableStatus(MainTableStatus.LOADED)
        }
      }
    }
  }

  useEffect(() => {
    if (
      mainTableState &&
      mainTableState.records &&
      mainTableState.records.length !== 0
    ) {
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
          height: 'calc(100vh - 60px - 40px)',
          overflow: 'scroll',
          flexGrow: 1,
          backgroundColor: Colors.LIGHT_GRAY5
        }}
      >
        <Table2
          numRows={records.length}
          enableRowHeader={false}
          enableMultipleSelection={false}
          loadingOptions={
            mainTableState && mainTableState.status === MainTableStatus.LOADING
              ? [TableLoadingOption.CELLS]
              : []
          }
        >
          {columns.map((columnName, index) => (
            <Column
              key={index}
              columnHeaderCellRenderer={(_: number) => (
                <ColumnHeaderCell2 name={columnName} />
              )}
              cellRenderer={(rowIndex: number, _: number) => {
                return (
                  <EditableCell2
                    value={sqlValueToJsValidValue(
                      records[rowIndex][columnName]
                    )}
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
